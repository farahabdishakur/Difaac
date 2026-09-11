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

# (host, asset_type, service, port, issue, exposure_score, shadow_it, status, hours_ago)
ASM_ASSETS: list[tuple[str, str, str | None, int | None, str | None, int, int, str, int]] = [
    ("legacy-vpn.difaac.io", "domain", "SSL VPN", 443, "End-of-life appliance, no vendor patches", 94, 1, "active", 3),
    ("staging-api.difaac.io", "domain", "HTTP API", 8080, "Staging environment reachable from the internet", 88, 1, "active", 8),
    ("mail-relay.difaac.io", "domain", "SMTP", 25, "Open relay test inconclusive, needs manual review", 76, 0, "active", 14),
    ("backup-01.difaac.io", "domain", "RDP", 3389, "Remote desktop exposed without a gateway", 91, 1, "active", 19),
    ("cdn-assets.difaac.io", "domain", "HTTPS", 443, None, 22, 0, "active", 26),
    ("difaac-reports.s3.amazonaws.com", "cloud", "Object storage", None, "Bucket listing enabled", 82, 1, "active", 31),
    ("41.203.18.44", "ip", "PostgreSQL", 5432, "Database port reachable from any address", 96, 0, "active", 38),
    ("41.203.18.51", "ip", "HTTPS", 443, "Certificate expires in 9 days", 48, 0, "active", 45),
    ("portal.difaac.io", "domain", "HTTPS", 443, None, 18, 0, "active", 52),
    ("old-blog.difaac.io", "domain", "HTTP", 80, "Unmaintained CMS, plaintext only", 71, 1, "active", 60),
    ("dev-jenkins.difaac.io", "domain", "Jenkins", 8443, "Build server exposed, anonymous read enabled", 89, 1, "active", 67),
    ("archive.difaac.io", "domain", "HTTPS", 443, None, 15, 0, "retired", 80),
]

# (subject, sender, recipient, threat_type, verdict, has_payload, confidence, hours_ago)
BEP_MESSAGES: list[tuple[str, str, str, str, str, int, int, int]] = [
    ("Updated bank details for this month's invoice", "accounts@difaac-finance.co", "finance@difaac.io", "bec", "blocked", 0, 97, 1),
    ("Urgent: approve this payment before close of business", "ceo.difaac@mail-secure.net", "finance@difaac.io", "bec", "blocked", 0, 95, 3),
    ("Purchase order 4471 attached", "orders@supplier-portal.net", "procurement@difaac.io", "malware", "detonated", 1, 92, 5),
    ("Your mailbox storage is full — verify now", "no-reply@difaac-webmail.info", "staff@difaac.io", "credential-harvest", "blocked", 1, 94, 7),
    ("Shared document: Q3 payroll", "hr-share@docs-viewer.co", "hr@difaac.io", "phishing", "quarantined", 1, 86, 11),
    ("RE: contract amendment", "legal@difaac-partners.org", "legal@difaac.io", "bec", "quarantined", 0, 78, 16),
    ("Delivery failed — reschedule your parcel", "tracking@parcel-notice.info", "staff@difaac.io", "phishing", "blocked", 1, 88, 21),
    ("Scanned document from the office printer", "scanner@difaac.io", "staff@difaac.io", "malware", "detonated", 1, 90, 28),
    ("Payroll correction — action required", "payroll@difaac-hr.net", "finance@difaac.io", "bec", "quarantined", 0, 81, 34),
    ("Security alert: unusual sign-in", "security@difaac-alerts.co", "staff@difaac.io", "credential-harvest", "blocked", 1, 93, 41),
    ("Invoice reminder", "billing@known-supplier.com", "finance@difaac.io", "phishing", "delivered", 1, 34, 49),
    ("Meeting notes", "colleague@difaac.io", "staff@difaac.io", "phishing", "delivered", 0, 21, 58),
]

# (rule, layer, severity, status, host, technique, hours_ago)
XDR_DETECTIONS: list[tuple[str, str, str, str, str | None, str | None, int]] = [
    ("Credential dumping via LSASS access", "endpoint", "critical", "contained", "WKS-2041", "T1003.001", 2),
    ("Encoded PowerShell spawned by Office", "endpoint", "critical", "contained", "WKS-1187", "T1059.001", 4),
    ("Beaconing to newly registered domain", "network", "high", "triaged", "WKS-2041", "T1071.001", 6),
    ("Suspicious OAuth consent granted", "cloud", "high", "open", None, "T1528", 9),
    ("Mailbox forwarding rule created", "email", "high", "open", None, "T1114.003", 12),
    ("Scheduled task created by unsigned binary", "endpoint", "medium", "triaged", "SRV-0032", "T1053.005", 17),
    ("Lateral SMB authentication burst", "network", "high", "contained", "SRV-0032", "T1021.002", 23),
    ("Impossible travel on admin account", "cloud", "medium", "closed", None, "T1078.004", 29),
    ("Archive password-protected on egress", "network", "medium", "open", "WKS-1187", "T1560.001", 36),
    ("Defender exclusion path added", "endpoint", "high", "triaged", "WKS-0918", "T1562.001", 44),
    ("Anomalous volume of file reads", "endpoint", "medium", "closed", "SRV-0011", "T1005", 52),
    ("Sign-in from unfamiliar ASN", "cloud", "low", "closed", None, "T1078", 61),
]

# (domain/handle, status, channel, risk, hours_ago, takedown_hours_after or None)
DRP_ITEMS: list[tuple[str, str, str, str, int, int | None]] = [
    ("difaac-secure-login.com", "takedown_in_progress", "domain", "critical", 2, None),
    ("difaac-support.info", "active", "domain", "high", 6, None),
    ("d1faac.com", "taken_down", "domain", "high", 30, 19),
    ("@difaac_official_help", "takedown_in_progress", "social", "high", 9, None),
    ("Difaac Wallet (unofficial)", "taken_down", "app-store", "critical", 54, 26),
    ("difaac-verify.net", "taken_down", "domain", "medium", 72, 31),
    ("@difaac.rewards", "active", "social", "medium", 15, None),
    ("Difaac branded merchandise listing", "taken_down", "marketplace", "low", 96, 58),
    ("difaac-billing.co", "monitoring", "domain", "medium", 21, None),
    ("Difaac Security (fake page)", "takedown_in_progress", "social", "high", 27, None),
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


# Threat-intelligence indicators of compromise. (value, type, severity, source)
TI_IOCS: list[tuple[str, str, str, str]] = [
    ("5f2b7e9c1a4d8f60b3c2e1a09d7f6543aabbccddeeff00112233445566778899", "SHA-256", "critical", "Managed XDR detonation"),
    ("update-service-sync[.]net", "Domain", "high", "Dark web forum monitoring"),
    ("45.147.230.14", "IP address", "high", "Honeypot telemetry"),
    ("secure-ebanking-verify[.]com", "Domain", "critical", "Brand protection crawl"),
    ("a1b2c3d4e5f60718293a4b5c6d7e8f90", "MD5", "medium", "Partner intel feed"),
    ("197.156.68.203", "IP address", "medium", "Fraud correlation"),
    ("wallet-topup-confirm[.]app", "Domain", "high", "Phishing kit analysis"),
    ("hxxps://cdn-airtime-bonus[.]xyz/win.js", "URL", "medium", "Email protection sandbox"),
]

# Tracked threat actors. (name, aliases, origin, description)
TI_ACTORS: list[tuple[str, str | None, str | None, str]] = [
    ("LockBit affiliate cluster", "Bitwise, LB-Aff-7", "Unknown / RaaS", "Ransomware-as-a-service affiliates seen advertising access to financial and telecom targets across the Horn of Africa."),
    ("Silent Mobile", "SIM-Swap Crew", "Regional", "Fraud ring specialising in SIM-swap and mobile-money account takeover against East African wallet platforms."),
    ("Anzu Stealer operators", "Anzu, DustCollector", "Unknown", "Info-stealer operators whose logs surface corporate credentials for regional banks on marketplace listings."),
    ("Bahri Phish", None, "Unknown", "Phishing crew cloning local bank and remittance brands to harvest credentials and one-time codes."),
    ("APT-Reef", "ReefViper", "State-aligned", "Espionage-oriented actor observed targeting government and NGO infrastructure in the region."),
]

# Security incidents. (title, severity, status, reported_by)
INCIDENTS: list[tuple[str, str, str, str]] = [
    ("Attempted ransomware deployment blocked on finance endpoint", "critical", "resolved", "Managed XDR"),
    ("Credential-stuffing wave against the customer portal", "high", "open", "Fraud Protection"),
    ("Phishing domain impersonating the mobile-money brand taken down", "medium", "resolved", "Digital Risk Protection"),
    ("Exposed admin panel found on a forgotten subdomain", "high", "open", "Attack Surface Management"),
    ("Business email compromise attempt on the finance team", "high", "open", "Email Protection"),
    ("Suspicious data export flagged for review", "medium", "review", "Managed XDR"),
]
