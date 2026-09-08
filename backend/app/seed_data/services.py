"""Seed data for the services table."""

SERVICES: list[dict] = [
    # Assessment
    {
        "slug": "penetration-testing",
        "name": "Penetration Testing",
        "group": "assessment",
        "icon": "Terminal",
        "tagline": "Find the path an attacker would take.",
        "description": (
            "Manual testing of applications, networks, and infrastructure "
            "by senior operators."
        ),
    },
    {
        "slug": "vulnerability-assessment",
        "name": "Vulnerability Assessment",
        "group": "assessment",
        "icon": "Bug",
        "tagline": "Get a full picture of exposure.",
        "description": (
            "Systematic scanning and validation of vulnerabilities "
            "across your environment."
        ),
    },
    {
        "slug": "red-teaming",
        "name": "Red Teaming",
        "group": "assessment",
        "icon": "Swords",
        "tagline": "Test detection, not just prevention.",
        "description": (
            "Simulate a real adversary to test people, process, "
            "and technology together."
        ),
    },
    {
        "slug": "compromise-assessment",
        "name": "Compromise Assessment",
        "group": "assessment",
        "icon": "Search",
        "tagline": "Confirm you are not already compromised.",
        "description": "Forensic sweep of your environment to detect existing intrusion.",
    },
    {
        "slug": "ai-red-teaming",
        "name": "AI Red Teaming",
        "group": "assessment",
        "icon": "Cpu",
        "tagline": "Stress-test your AI systems.",
        "description": (
            "Adversarial testing of models and AI-integrated applications "
            "for misuse and data exposure."
        ),
    },

    # Response
    {
        "slug": "incident-response",
        "name": "Incident Response",
        "group": "response",
        "icon": "Siren",
        "tagline": "Contain and recover, fast.",
        "description": (
            "On-demand response team available to contain and remediate "
            "active incidents."
        ),
    },
    {
        "slug": "digital-forensics",
        "name": "Digital Forensics",
        "group": "response",
        "icon": "Fingerprint",
        "tagline": "Understand exactly what happened.",
        "description": (
            "Forensic investigation to reconstruct the timeline "
            "and scope of an incident."
        ),
    },

    # Training
    {
        "slug": "technical-training",
        "name": "Technical training",
        "group": "training",
        "icon": "GraduationCap",
        "tagline": "Build skills your team keeps.",
        "description": (
            "Hands-on training for analysts, engineers, "
            "and incident responders."
        ),
    },
    {
        "slug": "management-masterclasses",
        "name": "Management masterclasses",
        "group": "training",
        "icon": "Presentation",
        "tagline": "Brief leadership on real risk.",
        "description": (
            "Executive briefings that translate technical risk "
            "into business decisions."
        ),
    },
    {
        "slug": "all-programs",
        "name": "All programs",
        "group": "training",
        "icon": "BookOpen",
        "tagline": "Browse the full training catalog.",
        "description": (
            "Every training program Difaac offers, "
            "from foundational to advanced."
        ),
    },

    # Investigation
    {
        "slug": "cyber-investigation",
        "name": "Cyber Investigation",
        "group": "investigation",
        "icon": "Search",
        "tagline": "Trace attacks back to their source.",
        "description": (
            "Attribution-focused investigation drawing on global "
            "threat actor intelligence."
        ),
    },
    {
        "slug": "investigation-subscription",
        "name": "Investigation Subscription",
        "group": "investigation",
        "icon": "FileSignature",
        "tagline": "Ongoing investigative support on demand.",
        "description": (
            "Subscription access to investigative resources "
            "across the year."
        ),
    },
]
