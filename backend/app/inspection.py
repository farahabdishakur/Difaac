"""Request inspection: the detection engine behind /api/inspect.

Every request Difaac protects is scored here before it reaches an
application. The engine is deliberately two layers, in this order:

  1. Signatures — deterministic patterns for the attack classes that make up
     the overwhelming majority of automated traffic: injection, cross-site
     scripting, path traversal, and known scanner tooling. These are fast,
     explainable, and produce no false negatives on the shapes they cover.

  2. Heuristics — cheap statistical signals that catch what a signature
     cannot: absurd payload sizes, header anomalies, high-entropy strings.

There is deliberately no model inference in this path. Inline inspection runs
on every request, so its budget is under a millisecond; a model call costs
orders of magnitude more and would make the proxy the slowest thing in the
stack. Machine learning belongs in the layer that scores *sessions* after the
fact, and a language model belongs in the layer that explains a detection to
an analyst — never here.

Scores are 0-100 and additive across matched rules, capped. The verdict
thresholds are set so that a single medium-confidence signature flags for
review, while blocking requires either a high-confidence match or several
corroborating ones.
"""

from __future__ import annotations

import math
import re
from dataclasses import dataclass, field
from urllib.parse import unquote_plus


@dataclass(frozen=True)
class Rule:
    """One detection. `weight` is how much matching it adds to the score."""

    id: str
    name: str
    pattern: re.Pattern[str]
    weight: int
    technique: str  # MITRE ATT&CK, so a detection lands in the same taxonomy
    # the rest of the platform already uses.


# Patterns are matched against the URL-decoded request, so `%27` and `'` are
# the same thing to the engine — encoding is the oldest evasion there is.
#
# Each is anchored on the structure of the attack rather than on a keyword, so
# `SELECT` in ordinary prose does not fire but `' OR 1=1--` does.
SIGNATURES: tuple[Rule, ...] = (
    Rule(
        "sqli-tautology",
        "SQL injection: boolean tautology",
        # The backreference is on the *unquoted* operand, so every common
        # spelling of the same trick matches: `OR 1=1`, `OR '1'='1`, and the
        # unterminated `OR 'x'='x` an injected fragment usually ends on. An
        # earlier version backreferenced the quoted operand and silently
        # missed all three.
        re.compile(r"\b(or|and)\s+['\"]?(\w+)['\"]?\s*(=|like)\s*['\"]?\2\b", re.I),
        45,
        "T1190",
    ),
    Rule(
        "sqli-union",
        "SQL injection: UNION SELECT",
        re.compile(r"\bunion\b[\s/*]+\bselect\b", re.I),
        50,
        "T1190",
    ),
    Rule(
        "sqli-comment",
        "SQL injection: statement terminator and comment",
        re.compile(r"(;|'|\")\s*(--|#|/\*)", re.I),
        25,
        "T1190",
    ),
    Rule(
        "sqli-stacked",
        "SQL injection: stacked destructive statement",
        re.compile(r";\s*(drop|delete|update|insert|truncate)\s+", re.I),
        50,
        "T1190",
    ),
    Rule(
        "xss-script-tag",
        "Cross-site scripting: injected script tag",
        re.compile(r"<\s*script[\s>]|<\s*/\s*script\s*>", re.I),
        45,
        "T1059.007",
    ),
    Rule(
        "xss-event-handler",
        "Cross-site scripting: inline event handler",
        re.compile(r"\bon(error|load|click|mouseover|focus)\s*=", re.I),
        35,
        "T1059.007",
    ),
    Rule(
        "xss-js-uri",
        "Cross-site scripting: javascript: URI",
        re.compile(r"javascript\s*:", re.I),
        30,
        "T1059.007",
    ),
    Rule(
        "traversal-dotdot",
        "Path traversal",
        re.compile(r"(\.\./|\.\.\\){2,}|/etc/(passwd|shadow)\b|\bboot\.ini\b", re.I),
        45,
        "T1083",
    ),
    Rule(
        "rce-command-chain",
        "Command injection: shell metacharacter chain",
        re.compile(r"(;|\||&&|`|\$\()\s*(cat|curl|wget|nc|bash|sh|powershell|whoami)\b", re.I),
        50,
        "T1059",
    ),
    Rule(
        "lfi-php-wrapper",
        "Local file inclusion: PHP stream wrapper",
        re.compile(r"php://(input|filter)|data://text", re.I),
        40,
        "T1083",
    ),
    Rule(
        "scanner-tooling",
        "Known scanner or exploitation tool",
        re.compile(r"\b(sqlmap|nikto|nmap|masscan|acunetix|nessus|dirbuster|gobuster|wpscan)\b", re.I),
        40,
        "T1595",
    ),
    Rule(
        "sensitive-path",
        "Probe for a sensitive path",
        re.compile(r"/(\.env|\.git/|wp-admin|wp-login|phpmyadmin|\.aws/credentials)\b", re.I),
        30,
        "T1595.003",
    ),
)


def _shannon_entropy(value: str) -> float:
    """Bits per character. High entropy in a short field suggests an encoded
    payload rather than something a person typed."""
    if not value:
        return 0.0
    counts: dict[str, int] = {}
    for ch in value:
        counts[ch] = counts.get(ch, 0) + 1
    length = len(value)
    return -sum((c / length) * math.log2(c / length) for c in counts.values())


@dataclass
class Finding:
    rule_id: str
    name: str
    weight: int
    technique: str
    where: str
    evidence: str


@dataclass
class Verdict:
    """The engine's answer for one request."""

    score: int
    action: str  # allow | flag | block
    findings: list[Finding] = field(default_factory=list)

    @property
    def severity(self) -> str:
        if self.score >= 70:
            return "critical"
        if self.score >= 45:
            return "high"
        if self.score >= 20:
            return "medium"
        return "low"


# Blocking is deliberately conservative. A false block is an outage for a real
# customer, which costs more than a missed low-confidence probe that the
# review queue will catch.
BLOCK_AT = 70
FLAG_AT = 25

# Requests larger than this are not inspected in full — an attacker can pad a
# payload to make the regex pass expensive. The prefix carries the attack in
# practice, and the truncation itself is a signal.
MAX_INSPECT_BYTES = 16_384


def _truncate(value: str) -> str:
    return value[:MAX_INSPECT_BYTES]


def inspect(
    *,
    path: str,
    query: str = "",
    body: str = "",
    user_agent: str = "",
    headers: dict[str, str] | None = None,
) -> Verdict:
    """Score one request against every rule.

    Each surface is decoded and scanned separately so a finding can name where
    it was seen — an analyst triaging a detection needs to know whether the
    payload arrived in the path, the query string, or the body.
    """
    headers = headers or {}
    surfaces: list[tuple[str, str]] = [
        ("path", unquote_plus(_truncate(path))),
        ("query", unquote_plus(_truncate(query))),
        ("body", unquote_plus(_truncate(body))),
        ("user-agent", _truncate(user_agent)),
    ]

    findings: list[Finding] = []
    for where, value in surfaces:
        if not value:
            continue
        for rule in SIGNATURES:
            match = rule.pattern.search(value)
            if match:
                findings.append(
                    Finding(
                        rule_id=rule.id,
                        name=rule.name,
                        weight=rule.weight,
                        technique=rule.technique,
                        where=where,
                        # A bounded slice around the match: enough to justify
                        # the finding, not so much that logging a detection
                        # copies an entire request body into the database.
                        evidence=value[max(0, match.start() - 20) : match.end() + 20][:160],
                    )
                )

    # Heuristics, applied once across the request rather than per surface.
    combined = f"{path}{query}{body}"
    if len(combined) > 4096:
        findings.append(
            Finding("oversized-request", "Unusually large request surface", 15, "T1499", "request",
                    f"{len(combined)} bytes")
        )
    if query and _shannon_entropy(query) > 4.8 and len(query) > 64:
        findings.append(
            Finding("high-entropy-query", "High-entropy query string", 15, "T1132", "query",
                    f"entropy {_shannon_entropy(query):.2f}")
        )
    if not user_agent:
        findings.append(
            Finding("missing-user-agent", "No user agent supplied", 10, "T1595", "user-agent", "")
        )

    score = min(sum(f.weight for f in findings), 100)
    action = "block" if score >= BLOCK_AT else "flag" if score >= FLAG_AT else "allow"
    return Verdict(score=score, action=action, findings=findings)
