"""Outbound email.

There is exactly one message this service sends today: the password reset
link. It used to be written to the application log with a note saying no email
service was wired up. That made the whole reset flow dead in production —
someone locked out clicked the button, was told "a reset link has been sent",
and nothing ever arrived. Telling a user their mail is on its way when the
code knows it is not is the part that had to go, more than the missing SMTP.

Built on `smtplib` from the standard library rather than a provider SDK. The
requirement is one message to one recipient over SMTP, which every provider
speaks — Gmail, a VPS relay, SES, Resend, Postmark. A dependency would buy
nothing here and would tie the deployment to one vendor's account.

Two properties this module has to keep:

*It never raises into a request.* A refused connection or a timeout must not
turn into a 500 on an endpoint whose whole design is to say the same thing to
every caller. `send` returns True or False and logs the reason.

*It never blocks the event loop.* The service runs one worker; a five-second
SMTP timeout inside the loop stalls every other request behind it. `send` is
synchronous and callers run it in a worker thread — see `send_async`.
"""

from __future__ import annotations

import logging
import smtplib
import ssl
from email.message import EmailMessage

import anyio.to_thread

from app.config import (
    SMTP_FROM,
    SMTP_HOST,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_STARTTLS,
    SMTP_TIMEOUT_SECONDS,
    SMTP_USERNAME,
)

logger = logging.getLogger(__name__)


def is_configured() -> bool:
    """Whether outbound mail can actually be sent.

    A host and a from-address are the minimum. Credentials are optional: a
    relay on the same host often accepts unauthenticated mail from localhost,
    and requiring a username would rule that out for no reason.
    """
    return bool(SMTP_HOST and SMTP_FROM)


def _build(to: str, subject: str, body: str) -> EmailMessage:
    message = EmailMessage()
    message["From"] = SMTP_FROM
    message["To"] = to
    message["Subject"] = subject
    # Plain text only. An HTML password-reset mail is more likely to be
    # rewritten by a mail gateway or flagged than one that is just a sentence
    # and a link, and there is nothing here that needs formatting.
    message.set_content(body)
    return message


def send(to: str, subject: str, body: str) -> bool:
    """Send one message. Returns whether it was accepted by the relay.

    Blocking. Call it through `send_async` from anywhere inside the event
    loop.
    """
    if not is_configured():
        logger.error("Refusing to send mail: SMTP is not configured.")
        return False

    message = _build(to, subject, body)

    try:
        if SMTP_PORT == 465:
            # Implicit TLS: the whole session is encrypted from the first
            # byte. Distinct from STARTTLS, which begins in the clear.
            with smtplib.SMTP_SSL(
                SMTP_HOST,
                SMTP_PORT,
                timeout=SMTP_TIMEOUT_SECONDS,
                context=ssl.create_default_context(),
            ) as server:
                if SMTP_USERNAME:
                    server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(message)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=SMTP_TIMEOUT_SECONDS) as server:
                if SMTP_STARTTLS:
                    # `create_default_context` verifies the certificate and
                    # the hostname. Without it the upgrade is encrypted but
                    # unauthenticated, which a network attacker can sit in
                    # the middle of.
                    server.starttls(context=ssl.create_default_context())
                if SMTP_USERNAME:
                    server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(message)
    except (smtplib.SMTPException, OSError, ssl.SSLError) as exc:
        # The recipient is logged; the body is not. A password reset link in
        # the application log is the thing this module exists to stop.
        logger.error("Failed to send mail to %s: %s", to, exc)
        return False

    logger.info("Sent %r to %s", subject, to)
    return True


async def send_async(to: str, subject: str, body: str) -> bool:
    """`send`, moved off the event loop."""
    return await anyio.to_thread.run_sync(send, to, subject, body)
