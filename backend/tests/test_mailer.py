"""Outbound mail, and the promise the reset endpoint is allowed to make.

The defect this covers was not a crash. `/auth/forgot-password` answered "if
that email is registered, a reset link has been sent" to every caller while
writing the link to the application log and sending nothing at all. The flow
looked healthy from the outside and was dead: a locked-out user waited for a
mail that was never coming, and the link sat in a log file where it did not
belong.

So the properties worth asserting are about honesty and about not leaking:

* Unconfigured, `send` refuses rather than half-trying.
* A relay that fails returns False rather than raising — the endpoint's whole
  design is to answer identically to every caller, and an exception escaping
  into it would answer differently for an address that exists.
* The message names the link, the expiry, and what to do if it was not you.

No database is needed for any of this.
"""

from __future__ import annotations

import os
import smtplib

import pytest

os.environ.setdefault("DIFAAC_DEBUG", "true")

from app import mailer  # noqa: E402
from app.routes.auth import _reset_email_body  # noqa: E402

LINK = "https://difaac.com/reset-password?token=abc123"


class TestConfigurationGate:
    def test_unconfigured_is_reported_as_unconfigured(self, monkeypatch):
        monkeypatch.setattr(mailer, "SMTP_HOST", "")
        monkeypatch.setattr(mailer, "SMTP_FROM", "")
        assert mailer.is_configured() is False

    def test_a_host_without_a_from_address_is_not_enough(self, monkeypatch):
        """The relay refuses a message with no envelope sender."""
        monkeypatch.setattr(mailer, "SMTP_HOST", "smtp.example.com")
        monkeypatch.setattr(mailer, "SMTP_FROM", "")
        assert mailer.is_configured() is False

    def test_host_and_from_are_enough(self, monkeypatch):
        """Credentials are optional: a local relay often needs none."""
        monkeypatch.setattr(mailer, "SMTP_HOST", "smtp.example.com")
        monkeypatch.setattr(mailer, "SMTP_FROM", "no-reply@difaac.com")
        assert mailer.is_configured() is True

    def test_sending_while_unconfigured_refuses_rather_than_trying(self, monkeypatch):
        monkeypatch.setattr(mailer, "SMTP_HOST", "")
        monkeypatch.setattr(mailer, "SMTP_FROM", "")

        def explode(*args, **kwargs):  # pragma: no cover - must not be reached
            raise AssertionError("attempted an SMTP connection with no configuration")

        monkeypatch.setattr(smtplib, "SMTP", explode)
        assert mailer.send("someone@example.com", "Subject", "Body") is False


class TestFailuresAreContained:
    @pytest.fixture(autouse=True)
    def _configured(self, monkeypatch):
        monkeypatch.setattr(mailer, "SMTP_HOST", "smtp.example.com")
        monkeypatch.setattr(mailer, "SMTP_FROM", "no-reply@difaac.com")
        monkeypatch.setattr(mailer, "SMTP_USERNAME", "")
        monkeypatch.setattr(mailer, "SMTP_STARTTLS", False)
        monkeypatch.setattr(mailer, "SMTP_PORT", 587)

    @pytest.mark.parametrize(
        "error",
        [
            smtplib.SMTPRecipientsRefused({}),
            smtplib.SMTPServerDisconnected("gone"),
            OSError("connection refused"),
            TimeoutError("timed out"),
        ],
    )
    def test_a_relay_failure_returns_false_and_does_not_raise(self, monkeypatch, error):
        """An exception here would reach an endpoint that must not vary."""

        def failing(*args, **kwargs):
            raise error

        monkeypatch.setattr(smtplib, "SMTP", failing)
        assert mailer.send("someone@example.com", "Subject", "Body") is False

    def test_a_successful_send_reports_success(self, monkeypatch):
        sent = {}

        class FakeSMTP:
            def __init__(self, host, port, timeout=None):
                sent["host"] = host
                sent["port"] = port

            def __enter__(self):
                return self

            def __exit__(self, *exc):
                return False

            def send_message(self, message):
                sent["to"] = message["To"]
                sent["from"] = message["From"]
                sent["subject"] = message["Subject"]
                sent["body"] = message.get_content()

        monkeypatch.setattr(smtplib, "SMTP", FakeSMTP)
        assert mailer.send("analyst@example.com", "Reset your Difaac password", "Body") is True
        assert sent["to"] == "analyst@example.com"
        assert sent["from"] == "no-reply@difaac.com"
        assert sent["host"] == "smtp.example.com"


class TestTheResetMessage:
    def test_it_carries_the_link(self):
        assert LINK in _reset_email_body(LINK)

    def test_it_states_the_expiry(self):
        """A link with no stated lifetime is one the reader saves for later."""
        from app.config import PASSWORD_RESET_TOKEN_EXPIRE_MINUTES

        assert str(PASSWORD_RESET_TOKEN_EXPIRE_MINUTES) in _reset_email_body(LINK)

    def test_it_tells_an_unexpecting_recipient_what_it_means(self):
        """An unprompted reset mail is the first sign someone is trying an address.

        The recipient is the only person who can recognise that, so the message
        has to say what to do about it.
        """
        body = _reset_email_body(LINK).lower()
        assert "did not ask" in body
        assert "administrator" in body

    def test_it_is_plain_text_with_no_markup(self):
        assert "<" not in _reset_email_body(LINK)
