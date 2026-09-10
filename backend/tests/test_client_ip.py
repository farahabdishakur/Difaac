"""Who a request is attributed to, behind a proxy and in front of one.

The rate limiter, the session record and every detection are keyed on the
caller's address. Behind Caddy the peer address is Caddy for everyone, so
without forwarded-header handling the whole internet shares one bucket: ten
auth attempts per minute for all callers combined, and a general budget a
handful of simultaneous visitors exhausts.

The fix has an obvious way to get it wrong. `X-Forwarded-For` is a string the
client writes; believing it unconditionally is worse than ignoring it, because
a caller could then present a fresh address per request and never be limited at
all. So these tests assert both halves: that a trusted proxy's header is read,
and that an untrusted peer's is not.
"""

from __future__ import annotations

import ipaddress

import pytest

from app import client_ip as client_ip_module


class _FakeClient:
    def __init__(self, host: str) -> None:
        self.host = host


class _FakeRequest:
    """Only the two attributes `client_ip` reads."""

    def __init__(self, peer: str | None, forwarded: str | None = None) -> None:
        self.client = _FakeClient(peer) if peer else None
        self.headers = {"x-forwarded-for": forwarded} if forwarded else {}


@pytest.fixture
def trusting(monkeypatch):
    """Trust one proxy network, the way docker-compose does."""
    networks = [ipaddress.ip_network("172.16.0.0/12")]
    monkeypatch.setattr(client_ip_module, "_TRUSTED", networks)
    return client_ip_module.client_ip


@pytest.fixture
def trusting_nobody(monkeypatch):
    """The default: no proxy configured, so the header means nothing."""
    monkeypatch.setattr(client_ip_module, "_TRUSTED", [])
    return client_ip_module.client_ip


class TestWithoutATrustedProxy:
    def test_the_peer_address_is_used(self, trusting_nobody):
        assert trusting_nobody(_FakeRequest("203.0.113.9")) == "203.0.113.9"

    def test_a_forwarded_header_is_ignored(self, trusting_nobody):
        """This is the spoofing case, and it must not work.

        A caller reaching the service directly can send any header it likes.
        If that were believed, every request could claim a different address
        and the rate limit would be unenforceable.
        """
        request = _FakeRequest("203.0.113.9", forwarded="10.0.0.1")
        assert trusting_nobody(request) == "203.0.113.9"

    def test_a_missing_client_is_named_rather_than_crashing(self, trusting_nobody):
        assert trusting_nobody(_FakeRequest(None)) == client_ip_module.UNKNOWN


class TestBehindATrustedProxy:
    def test_the_forwarded_address_is_used(self, trusting):
        request = _FakeRequest("172.18.0.4", forwarded="203.0.113.9")
        assert trusting(request) == "203.0.113.9"

    def test_a_client_supplied_prefix_is_discarded(self, trusting):
        """The proxy appends; it does not replace.

        A caller that sends `X-Forwarded-For: 1.1.1.1` arrives at the backend
        as `1.1.1.1, <real address>`. Reading from the left would take the
        forged value and hand the caller a fresh rate-limit bucket on demand.
        Reading from the right takes the entry our own proxy added.
        """
        request = _FakeRequest("172.18.0.4", forwarded="1.1.1.1, 203.0.113.9")
        assert trusting(request) == "203.0.113.9"

    def test_chained_proxies_are_stepped_over(self, trusting):
        """Two trusted hops still resolve to the address in front of them."""
        request = _FakeRequest("172.18.0.4", forwarded="203.0.113.9, 172.18.0.9")
        assert trusting(request) == "203.0.113.9"

    def test_a_trusted_peer_with_no_header_falls_back_to_itself(self, trusting):
        assert trusting(_FakeRequest("172.18.0.4")) == "172.18.0.4"

    def test_a_garbage_chain_falls_back_rather_than_guessing(self, trusting):
        request = _FakeRequest("172.18.0.4", forwarded="not-an-address")
        assert trusting(request) == "172.18.0.4"

    def test_ipv4_mapped_addresses_normalise_to_one_bucket(self, trusting):
        """Otherwise the same caller could spend two budgets."""
        plain = trusting(_FakeRequest("172.18.0.4", forwarded="203.0.113.9"))
        mapped = trusting(_FakeRequest("172.18.0.4", forwarded="::ffff:203.0.113.9"))
        assert plain == mapped == "203.0.113.9"


class TestConfigurationParsing:
    def test_a_bare_address_is_accepted_as_one_host(self):
        networks = client_ip_module._parse_networks(["10.0.0.5"])
        assert ipaddress.ip_address("10.0.0.5") in networks[0]
        assert ipaddress.ip_address("10.0.0.6") not in networks[0]

    def test_an_unparseable_entry_is_dropped_not_fatal(self):
        """A typo must not take the service down, and must not widen trust."""
        networks = client_ip_module._parse_networks(["nonsense", "172.16.0.0/12"])
        assert len(networks) == 1
