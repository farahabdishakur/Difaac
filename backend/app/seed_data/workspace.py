"""Demonstration data for the SOC workspace.

This is sample data for a development and demo environment, not a customer's
real security posture. It exists so the workspace can be opened, reviewed, and
screenshotted without first wiring up live collection.

The alerts and actors below describe publicly documented, widely reported
threat activity (ransomware families, commodity loaders, credential-stuffing
patterns). They are written as generic examples rather than as claims about
any specific Difaac customer.

Timestamps are relative offsets in hours, resolved to real datetimes at insert
time, so a freshly seeded database always looks current instead of showing
dates from whenever this file was written.
"""

from __future__ import annotations

# (title, category, severity, source, actor, is_tailored, hours_ago)
TI_ALERTS: list[tuple[str, str, str, str, str | None, int, int]] = [
    (
        "Ransomware operator advertising access to a regional financial institution",
        "ransomware",
        "critical",
        "Dark web forum monitoring",
        "LockBit affiliate",
        1,
        2,
    ),
    (
        "3,144 stealer logs containing corporate credentials offered for sale",
        "data-leak",
        "critical",
        "Marketplace collection",
        None,
        1,
        6,
    ),
    (
        "155 new mentions of monitored brand terms across closed forums",
        "darkweb",
        "high",
        "Dark web forum monitoring",
        None,
        1,
        9,
    ),
    (
        "Phishing kit targeting mobile banking login flows detected in the wild",
        "phishing",
        "high",
        "Phishing kit analysis",
        None,
        0,
        14,
    ),
    (
        "Emotet-style loader distributing follow-on payloads via macro documents",
        "malware",
        "high",
        "Malware sandbox",
        "TA542",
        0,
        20,
    ),
    (
        "Credential stuffing infrastructure rotating across 40+ residential proxies",
        "fraud",
        "medium",
        "Fraud telemetry",
        None,
        1,
        27,
    ),
    (
        "Typosquatted domain registered against a monitored brand term",
        "phishing",
        "medium",
        "Domain registration feed",
        None,
        1,
        33,
    ),
    (
        "Commodity infostealer build shared publicly with updated evasion",
        "malware",
        "medium",
        "Malware sandbox",
        None,
        0,
        41,
    ),
    (
        "Discussion of a sector-specific intrusion technique on a closed forum",
        "darkweb",
        "low",
        "Dark web forum monitoring",
        None,
        0,
        52,
    ),
    (
        "Exposed configuration file indexed by an internet-wide scanner",
        "data-leak",
        "low",
        "Attack surface scanning",
        None,
        1,
        66,
    ),
]

# (session_id, risk_score, status, signal, channel, country, hours_ago)
FRAUD_CASES: list[tuple[str, int, str, str, str, str, int]] = [
    ("sess_a1b2c3", 97, "blocked", "Credential stuffing", "web", "Somalia", 1),
    ("sess_d4e5f6", 94, "blocked", "Bot automation", "web", "Kenya", 2),
    ("sess_g7h8i9", 91, "blocked", "Device spoofing", "mobile", "Ethiopia", 4),
    ("sess_j1k2l3", 88, "requires_investigation", "Impossible travel", "web", "Djibouti", 5),
    ("sess_m4n5o6", 84, "requires_investigation", "Account takeover", "mobile", "Somalia", 7),
    ("sess_p7q8r9", 79, "requires_investigation", "Device spoofing", "web", "Somalia", 9),
    ("sess_s1t2u3", 73, "monitoring", "Bot automation", "web", "Kenya", 12),
    ("sess_v4w5x6", 68, "monitoring", "Session anomaly", "mobile", "Somalia", 15),
    ("sess_y7z8a9", 61, "monitoring", "Session anomaly", "web", "Ethiopia", 18),
    ("sess_b1c2d3", 54, "monitoring", "Impossible travel", "mobile", "Djibouti", 22),
    ("sess_e4f5g6", 47, "cleared", "Session anomaly", "web", "Somalia", 28),
    ("sess_h7i8j9", 39, "cleared", "Device spoofing", "mobile", "Kenya", 35),
]
