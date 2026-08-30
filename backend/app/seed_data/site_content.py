"""Seed data for the site_content table.

Each key maps to a JSON blob used by the frontend for badges, stats,
partner logos, and other site-wide UI elements.
"""

SITE_CONTENT: dict[str, list] = {
    "analystBadges": [
        "Gartner",
        "Forrester",
        "IDC",
        "MITRE ATT&CK",
        "Cybersecurity Excellence Awards",
    ],

    "partnerAgencies": [
        "INTERPOL",
        "EUROPOL",
        "AFRIPOL",
    ],

    "globalOperations": [
        {
            "name": "Operation Distanthill",
            "description": (
                "Coordinated takedown of a ransomware affiliate network "
                "across three continents."
            ),
        },
        {
            "name": "Operation Kaerb",
            "description": (
                "Disruption of a phishing-as-a-service platform used "
                "against financial institutions."
            ),
        },
        {
            "name": "Operation GoldDragon",
            "description": (
                "Joint investigation into a state-linked group "
                "targeting critical infrastructure."
            ),
        },
    ],

    "stats": [
        {"value": "1,550+", "label": "Successful investigations"},
        {"value": "$1B+", "label": "Real losses prevented"},
        {"value": "#1", "label": "Incident Response retainer vendor"},
        {"value": "24/7", "label": "Global SOC coverage"},
    ],

    "awardBadges": [
        {"label": "Threat Intelligence Leader", "icon": "Award"},
        {"label": "Best Support", "icon": "HeartHandshake"},
        {"label": "Easiest Setup", "icon": "Zap"},
        {"label": "Highest User Adoption", "icon": "TrendingUp"},
        {"label": "Best Relationship", "icon": "Handshake"},
        {"label": "Most Implementable", "icon": "CheckCircle2"},
    ],

    "trustBarLogos": [
        "Meridian Bank",
        "Northfield Retail",
        "Vantage Telecom",
        "Aurora Health",
        "Pallas Energy",
        "Continental Freight",
    ],

    "heroStats": [
        {"value": "1,200+", "label": "Enterprise customers"},
        {"value": "70+", "label": "Countries protected"},
        {"value": "99.9%", "label": "Threat detection accuracy"},
        {"value": "24/7", "label": "Global SOC coverage"},
    ],
}
