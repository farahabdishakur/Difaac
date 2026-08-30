"""Seed data for the resources table."""

RESOURCES: list[dict] = [
    {
        "slug": "high-tech-crime-trends-2026",
        "title": "High-Tech Crime Trends 2026",
        "type": "Trend Report",
        "excerpt": (
            "A year of threat actor activity, distilled into the trends "
            "shaping 2026 security budgets."
        ),
        "isNew": True,
    },
    {
        "slug": "ransomware-negotiation-playbook",
        "title": "The ransomware negotiation playbook",
        "type": "White Paper",
        "excerpt": (
            "What to do in the first 24 hours after a ransomware "
            "notice appears."
        ),
        "isNew": True,
    },
    {
        "slug": "inside-a-phishing-kit-marketplace",
        "title": "Inside a phishing-kit marketplace",
        "type": "Threat Research",
        "excerpt": (
            "How off-the-shelf phishing kits are bought, sold, "
            "and updated in closed forums."
        ),
        "isNew": False,
    },
    {
        "slug": "building-a-cti-program-guide",
        "title": "Building a threat intelligence program",
        "type": "Guide",
        "excerpt": (
            "A practical framework for standing up CTI capability "
            "without a dedicated headcount."
        ),
        "isNew": False,
    },
    {
        "slug": "attack-surface-blind-spots",
        "title": "The blind spots in your attack surface",
        "type": "Threat Research",
        "excerpt": (
            "Why shadow IT and forgotten subdomains remain the most "
            "common entry point."
        ),
        "isNew": False,
    },
    {
        "slug": "fraud-rings-anatomy",
        "title": "The anatomy of a fraud ring",
        "type": "White Paper",
        "excerpt": (
            "How coordinated fraud networks organize, recruit, "
            "and cash out."
        ),
        "isNew": False,
    },
]
