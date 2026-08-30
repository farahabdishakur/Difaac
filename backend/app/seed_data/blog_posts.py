"""Seed data for the blog_posts table."""

BLOG_POSTS: list[dict] = [
    {
        "slug": "why-attack-surface-drifts",
        "title": "Why your attack surface drifts every quarter",
        "excerpt": "Asset sprawl is not a one-time cleanup problem. It is continuous.",
        "date": "2026-06-02",
        "category": "Attack Surface",
    },
    {
        "slug": "bec-without-a-payload",
        "title": "Business email compromise without a payload",
        "excerpt": "The most costly email attacks contain no malware at all.",
        "date": "2026-05-18",
        "category": "Email Security",
    },
    {
        "slug": "reading-a-ransomware-note",
        "title": "What a ransomware note tells you about the actor",
        "excerpt": (
            "Naming conventions and negotiation tone often reveal "
            "the group behind an attack."
        ),
        "date": "2026-04-29",
        "category": "Threat Intelligence",
    },
    {
        "slug": "fraud-teams-need-cti",
        "title": "Fraud teams need threat intelligence too",
        "excerpt": "The line between fraud and cybercrime keeps disappearing.",
        "date": "2026-04-11",
        "category": "Fraud",
    },
]
