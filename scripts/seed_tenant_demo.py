"""Seed one tenant's workspace with data shaped like its sector.

Written for showing a prospective customer their own console rather than
Difaac's. The rows are illustrative and clearly marked as such: every asset,
alert and incident here is invented, and nobody should be able to mistake it
for something the platform observed.

    python scripts/seed_tenant_demo.py --tenant borama-hospital --sector healthcare
    python scripts/seed_tenant_demo.py --tenant borama-hospital --clear

The rows are written with the tenant's own policy satisfied, which is the only
way they can be written at all — the row-level security that keeps one
customer out of another's data applies just as much to a seeding script.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

import psycopg
from psycopg.rows import dict_row

from app.config import DATABASE_URL
from app.tenancy import TENANT_SETTING

# What a hospital's estate actually looks like: clinical systems that cannot
# take an agent and cannot be taken offline, sitting beside ordinary IT.
# The status strings have to match what the dashboard queries filter on —
# asm_assets counts `active`, incidents group by `Open`/`Investigating`/
# `Resolved`. Inventing plausible-looking values instead produced a console
# reporting zero assets while holding ten, which is the failure this data
# exists to avoid.
HEALTHCARE = {
    "asm_assets": [
        ("pacs.hospital.internal", "Imaging", "DICOM", 104, "Unauthenticated DICOM listener", 91, False, "active"),
        ("ehr.hospital.internal", "Application", "HTTPS", 443, None, 34, False, "active"),
        ("portal.hospital.example", "Web", "HTTPS", 443, "TLS 1.0 still accepted", 68, False, "active"),
        ("vpn.hospital.example", "Network", "IKE", 500, "No MFA on remote access", 84, False, "active"),
        ("pump-ward3-07.hospital.internal", "Medical device", "Telnet", 23, "Vendor default credentials", 96, False, "active"),
        ("mri-console.hospital.internal", "Medical device", "RDP", 3389, "Windows 7, unpatchable by vendor", 93, False, "active"),
        ("lab-share.hospital.internal", "File share", "SMB", 445, "SMBv1 enabled", 77, False, "active"),
        ("wifi-guest.hospital.internal", "Network", "HTTP", 80, "Guest network reaches clinical VLAN", 88, True, "active"),
        ("payroll.hospital.internal", "Application", "HTTPS", 443, None, 22, False, "retired"),
        ("backup-nas.hospital.internal", "Storage", "NFS", 2049, "Backups reachable from the clinical VLAN", 95, False, "active"),
    ],
    "incidents": [
        ("Ransomware staging detected on the imaging VLAN", "Critical", "Open", "Difaac SOC"),
        ("Credential stuffing against the patient portal", "High", "Investigating", "Difaac SOC"),
        ("Vendor laptop connected to the clinical network without approval", "Medium", "Investigating", "Hospital IT"),
        ("Phishing wave impersonating the hospital's HR department", "High", "Resolved", "Difaac SOC"),
    ],
    "ti_alerts": [
        ("Ransomware group advertising access to a Horn of Africa hospital", "Ransomware", "critical", "Dark web forum", "Cl0p", True),
        ("Patient records offered for sale, sample matches your domain", "Data leak", "critical", "Leak market", None, True),
        ("Exploit published for the imaging platform you run", "Vulnerability", "high", "Vendor advisory", None, True),
        ("Credentials for hospital.example seen in a combolist", "Credential leak", "high", "Paste site", None, True),
        ("Phishing kit targeting hospital payroll portals", "Phishing", "medium", "Difaac research", None, False),
        ("Medical device botnet scanning port 23 across the region", "Botnet", "medium", "Difaac sensors", None, False),
    ],
    "bep_messages": [
        ("Urgent: updated patient transfer form", "hr@hospita1.example", "records@hospital.example", "phishing", "blocked", True, 97),
        ("Invoice for imaging contrast supplies", "billing@medsupply-invoice.example", "finance@hospital.example", "bec", "quarantined", True, 88),
        ("Your payroll details need confirming", "no-reply@hospital-hr.example", "staff@hospital.example", "credential_theft", "blocked", False, 94),
        ("Radiology report attached", "noreply@dicom-share.example", "radiology@hospital.example", "malware", "detonated", True, 99),
        ("Board meeting minutes", "chair@hospital.example", "exec@hospital.example", "clean", "delivered", False, 12),
    ],
    "drp_phishing": [
        ("hospital-appointments.example", "active", "domain", "high"),
        ("hospita1-portal.example", "taken_down", "domain", "critical"),
        ("hospital-hr-payroll.example", "active", "domain", "high"),
        ("@hospital_official_so", "taken_down", "social", "medium"),
    ],
}


def seed(conn, tenant_id: int) -> None:
    conn.execute("SELECT set_config(%s, %s, false)", (TENANT_SETTING, str(tenant_id)))

    for host, kind, service, port, issue, score, shadow, status in HEALTHCARE["asm_assets"]:
        conn.execute(
            "INSERT INTO asm_assets"
            " (tenant_id, host, asset_type, service, port, issue, exposure_score,"
            "  is_shadow_it, status)"
            " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (tenant_id, host, kind, service, port, issue, score, shadow, status),
        )
    for title, severity, status, reporter in HEALTHCARE["incidents"]:
        conn.execute(
            "INSERT INTO incidents (tenant_id, title, severity, status, reported_by)"
            " VALUES (%s, %s, %s, %s, %s)",
            (tenant_id, title, severity, status, reporter),
        )
    for title, category, severity, source, actor, tailored in HEALTHCARE["ti_alerts"]:
        conn.execute(
            "INSERT INTO ti_alerts"
            " (tenant_id, title, category, severity, source, actor, is_tailored)"
            " VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (tenant_id, title, category, severity, source, actor, tailored),
        )
    for subject, sender, recipient, threat, verdict, payload, confidence in HEALTHCARE["bep_messages"]:
        conn.execute(
            "INSERT INTO bep_messages"
            " (tenant_id, subject, sender, recipient, threat_type, verdict,"
            "  has_payload, confidence)"
            " VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            (tenant_id, subject, sender, recipient, threat, verdict, payload, confidence),
        )
    for domain, status, channel, risk in HEALTHCARE["drp_phishing"]:
        conn.execute(
            "INSERT INTO drp_phishing (tenant_id, domain, status, channel, risk)"
            " VALUES (%s, %s, %s, %s, %s)",
            (tenant_id, domain, status, channel, risk),
        )


def clear(conn, tenant_id: int) -> None:
    conn.execute("SELECT set_config(%s, %s, false)", (TENANT_SETTING, str(tenant_id)))
    for table in ("asm_assets", "incidents", "ti_alerts", "bep_messages", "drp_phishing",
                  "fraud_cases", "ti_iocs", "ti_actors", "xdr_detections"):
        conn.execute(f"DELETE FROM {table}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tenant", required=True, help="tenant slug")
    parser.add_argument("--sector", default="healthcare", choices=["healthcare"])
    parser.add_argument("--clear", action="store_true", help="empty this tenant instead")
    args = parser.parse_args()

    with psycopg.connect(DATABASE_URL, row_factory=dict_row, autocommit=True) as conn:
        row = conn.execute(
            "SELECT id, name FROM tenants WHERE slug = %s", (args.tenant,)
        ).fetchone()
        if not row:
            sys.exit(f"No tenant '{args.tenant}'. Create it with manage_users.py tenants --add")

        if args.clear:
            clear(conn, row["id"])
            print(f"Cleared the workspace for {row['name']}.")
        else:
            clear(conn, row["id"])
            seed(conn, row["id"])
            counts = {
                t: conn.execute(f"SELECT COUNT(*) AS n FROM {t}").fetchone()["n"]
                for t in ("asm_assets", "incidents", "ti_alerts", "bep_messages", "drp_phishing")
            }
            print(f"Seeded {row['name']}:")
            for table, n in counts.items():
                print(f"  {table:<16} {n}")
        conn.execute("SELECT set_config(%s, '', false)", (TENANT_SETTING,))


if __name__ == "__main__":
    main()
