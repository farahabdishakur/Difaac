"""Seed data for the solutions table."""

SOLUTIONS: list[dict] = [
    # Use-case solutions
    {
        "slug": "ransomware-protection",
        "name": "Ransomware Protection",
        "group": "use-case",
        "icon": "Lock",
        "tagline": "Stop encryption before it starts.",
        "description": (
            "Detect ransomware precursors and disrupt the kill chain "
            "before files are encrypted."
        ),
        "highlights": None,
    },
    {
        "slug": "phishing-scam-protection",
        "name": "Phishing & Scam Protection",
        "group": "use-case",
        "icon": "Mail",
        "tagline": "Take down phishing infrastructure fast.",
        "description": (
            "Identify and remove phishing domains and scam campaigns "
            "targeting your brand."
        ),
        "highlights": None,
    },
    {
        "slug": "bot-protection",
        "name": "Bot Protection",
        "group": "use-case",
        "icon": "Bot",
        "tagline": "Separate humans from automation.",
        "description": (
            "Block scraping, credential stuffing, and scalping bots "
            "without adding CAPTCHAs everywhere."
        ),
        "highlights": None,
    },
    {
        "slug": "dark-web-monitoring",
        "name": "Dark Web Monitoring",
        "group": "use-case",
        "icon": "Eye",
        "tagline": "See what adversaries see.",
        "description": (
            "Monitor closed forums and marketplaces for mentions "
            "of your organization."
        ),
        "highlights": None,
    },
    {
        "slug": "data-leak-detection",
        "name": "Data Leak Detection",
        "group": "use-case",
        "icon": "Database",
        "tagline": "Find leaked data before it spreads.",
        "description": (
            "Detect exposed credentials, source code, and customer data "
            "across the open and dark web."
        ),
        "highlights": None,
    },
    {
        "slug": "vulnerability-management",
        "name": "Vulnerability Management",
        "group": "use-case",
        "icon": "Bug",
        "tagline": "Prioritize what actually gets exploited.",
        "description": (
            "Rank vulnerabilities by real-world exploitation, "
            "not just CVSS score."
        ),
        "highlights": None,
    },
    {
        "slug": "network-security",
        "name": "Network Security",
        "group": "use-case",
        "icon": "Network",
        "tagline": "Detect intrusion across the network layer.",
        "description": (
            "Identify lateral movement and command-and-control traffic "
            "across your network."
        ),
        "highlights": None,
    },

    # Role-based solutions
    {
        "slug": "ciso",
        "name": "CISO",
        "group": "role",
        "icon": "ShieldCheck",
        "tagline": "Report risk in terms the board understands.",
        "description": "Translate technical findings into board-ready risk reporting.",
        "highlights": [
            "Executive risk dashboards updated in real time",
            "Board-ready reporting templates",
            "Benchmarking against industry peers",
            "Consolidated vendor risk visibility",
        ],
    },
    {
        "slug": "head-of-fraud",
        "name": "Head of Fraud",
        "group": "role",
        "icon": "AlertTriangle",
        "tagline": "Cut losses without adding friction.",
        "description": (
            "Reduce fraud losses while keeping checkout and onboarding fast."
        ),
        "highlights": [
            "Device and behavioral fingerprinting",
            "Real-time transaction risk scoring",
            "Account takeover prevention",
            "Chargeback and dispute analytics",
        ],
    },
    {
        "slug": "head-of-brand-protection",
        "name": "Head of Brand Protection",
        "group": "role",
        "icon": "Fingerprint",
        "tagline": "Defend the brand across every channel.",
        "description": (
            "Monitor and remove impersonation across web, social, "
            "and marketplaces."
        ),
        "highlights": [
            "Automated takedown workflows",
            "Marketplace counterfeit detection",
            "Executive impersonation monitoring",
            "Social media brand abuse alerts",
        ],
    },
    {
        "slug": "head-of-threat-intelligence",
        "name": "Head of Threat Intelligence",
        "group": "role",
        "icon": "Radar",
        "tagline": "Run a program that scales with the threat.",
        "description": (
            "Operationalize intelligence across detection, response, "
            "and leadership reporting."
        ),
        "highlights": [
            "Curated adversary profiles and TTPs",
            "Automated IOC enrichment and feeds",
            "Sector-specific threat briefings",
            "Integration with existing SIEM/SOAR",
        ],
    },
    {
        "slug": "soc-manager",
        "name": "SOC Manager",
        "group": "role",
        "icon": "Activity",
        "tagline": "Cut alert fatigue, not coverage.",
        "description": (
            "Reduce noise while improving detection fidelity across the SOC."
        ),
        "highlights": [
            "Alert triage prioritized by confirmed risk",
            "Playbook-driven response automation",
            "Cross-team case management",
            "Analyst performance analytics",
        ],
    },
    {
        "slug": "security-analyst",
        "name": "Security Analyst",
        "group": "role",
        "icon": "Search",
        "tagline": "Investigate faster with better context.",
        "description": (
            "Give analysts the context they need to triage "
            "in minutes, not hours."
        ),
        "highlights": [
            "One-click pivoting across intelligence sources",
            "Enriched indicators with adversary context",
            "Guided investigation workflows",
            "Exportable case reports",
        ],
    },
]
