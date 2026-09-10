"""Who a request actually came from.

Behind a reverse proxy every connection arrives from the proxy, so the peer
address is the same value for every caller on the internet. Anything that
distinguishes callers — the rate limiter above all, but also the address
written into the session and audit records — reads the wrong thing unless it
is told how to look past the proxy.

`X-Forwarded-For` is what carries the real address, and it is also the reason
this module is not two lines. The header is a client-controllable string: a
caller can send one with whatever they like in it, and the proxy appends
rather than replaces. Trusting it unconditionally is worse than ignoring it —
it would let an attacker present a fresh address on every request and make the
rate limit unenforceable, which is precisely the control it exists to defeat.

So the rule is: trust the header only from a peer that is on the trusted list,
and then read the chain from the right, discarding entries that are themselves
trusted proxies. The first address from the right that is not a trusted proxy
is the furthest-left address that our own infrastructure vouched for.
Everything to the left of it was written by somebody we do not control and is
discarded.

With no trusted proxies configured — the default — the header is ignored
entirely and the peer address is used. That is the correct behaviour for a
service exposed directly, and it fails closed: a misconfiguration means
callers share a bucket, never that a caller can escape one.
"""

from __future__ import annotations

import ipaddress
import logging

from fastapi import Request

from app.config import TRUSTED_PROXIES

logger = logging.getLogger(__name__)

UNKNOWN = "unknown"


def _parse_networks(entries: list[str]) -> list[ipaddress.IPv4Network | ipaddress.IPv6Network]:
    """Turn the configured list into networks, skipping what does not parse.

    A bare address is accepted and treated as a single-host network, because
    "10.0.0.5" is what an operator writes when they mean one proxy.
    """
    networks = []
    for entry in entries:
        try:
            networks.append(ipaddress.ip_network(entry, strict=False))
        except ValueError:
            logger.error(
                "Ignoring unparseable entry in DIFAAC_TRUSTED_PROXIES: %r. "
                "Expected an address or CIDR block, e.g. 172.16.0.0/12.",
                entry,
            )
    return networks


_TRUSTED = _parse_networks(TRUSTED_PROXIES)


def _normalise(address: str) -> str | None:
    """Canonical text for an address, or None if it is not one.

    IPv4-mapped IPv6 (`::ffff:203.0.113.9`) is unwrapped to its IPv4 form. A
    dual-stack proxy can present either spelling for the same caller, and two
    spellings would be two rate-limit buckets — half the limit is no limit.
    """
    try:
        parsed = ipaddress.ip_address(address)
    except ValueError:
        return None
    mapped = getattr(parsed, "ipv4_mapped", None)
    return str(mapped or parsed)


def _is_trusted(address: str) -> bool:
    if not _TRUSTED:
        return False
    canonical = _normalise(address)
    if canonical is None:
        return False
    parsed = ipaddress.ip_address(canonical)
    return any(parsed in network for network in _TRUSTED)


def client_ip(request: Request) -> str:
    """The caller's address, looking through trusted proxies only."""
    peer = request.client.host if request.client else None
    if not peer:
        return UNKNOWN
    if not _is_trusted(peer):
        # Either nothing is configured, or this connection did not come from a
        # proxy we put there. Its own address is the only value it cannot lie
        # about, so it is the only one worth using.
        return _normalise(peer) or peer

    forwarded = request.headers.get("x-forwarded-for", "")
    for candidate in reversed([part.strip() for part in forwarded.split(",") if part.strip()]):
        if _is_trusted(candidate):
            continue
        normalised = _normalise(candidate)
        if normalised is None:
            # A garbage entry says the header cannot be believed from here on.
            # Fall back rather than guess at what was meant.
            break
        return normalised

    # A trusted peer that sent no usable chain. Its own address is still a
    # real, unspoofable identity — one shared by everything behind it, which
    # is the conservative direction to be wrong in.
    return _normalise(peer) or peer


def trusted_proxy_count() -> int:
    """How many proxy networks are trusted. Used by start-up logging."""
    return len(_TRUSTED)
