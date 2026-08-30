import sqlite3
import random
from datetime import datetime, timedelta

def seed_new_tables():
    conn = sqlite3.connect("app/difaac.db")
    
    # Check if TI Actors exist
    count = conn.execute("SELECT COUNT(*) FROM ti_actors").fetchone()[0]
    if count > 0:
        print("Data already seeded.")
        return

    print("Seeding TI Actors...")
    actors = [
        ("APT29", "Cozy Bear, The Dukes", "Russia", "Espionage and intelligence gathering targeting government networks."),
        ("Lazarus Group", "Hidden Cobra, Zinc", "North Korea", "Financially motivated attacks and destructive malware."),
        ("Fancy Bear", "APT28, Sofacy", "Russia", "Cyber espionage targeting military and defense organizations."),
        ("Mummy Spider", "Emotet", "Unknown", "Operates the Emotet botnet, providing initial access to ransomware groups.")
    ]
    conn.executemany(
        "INSERT INTO ti_actors (name, aliases, origin, description) VALUES (?, ?, ?, ?)",
        actors
    )

    print("Seeding TI IOCs...")
    iocs = [
        ("192.168.100.45", "IP", "High", "Lazarus Group Campaign"),
        ("malicious-update.com", "Domain", "Critical", "Emotet C2"),
        ("a1b2c3d4e5f6g7h8i9j0", "Hash", "Medium", "Suspicious Excel Macro"),
        ("evil-login-portal.net", "Domain", "High", "APT29 Credential Harvesting")
    ]
    conn.executemany(
        "INSERT INTO ti_iocs (value, type, severity, source) VALUES (?, ?, ?, ?)",
        iocs
    )

    print("Seeding DRP Phishing Domains...")
    phishing = [
        ("difaac-security-update.com", "Active"),
        ("secure-difaac-login.net", "Takedown In Progress"),
        ("difaac-support.info", "Offline"),
        ("d1faac.com", "Active")
    ]
    conn.executemany(
        "INSERT INTO drp_phishing (domain, status) VALUES (?, ?)",
        phishing
    )

    print("Seeding Fraud Cases...")
    fraud = [
        ("sess_a1b2", 95, "Blocked"),
        ("sess_x9y8", 88, "Requires Investigation"),
        ("sess_m4n5", 99, "Blocked"),
        ("sess_p0q1", 75, "Monitoring")
    ]
    conn.executemany(
        "INSERT INTO fraud_cases (session_id, risk_score, status) VALUES (?, ?, ?)",
        fraud
    )

    print("Seeding Incidents...")
    incidents = [
        ("Ransomware attempt on internal network", "Critical", "Open", "SOC Analyst 1"),
        ("Suspicious login from unusual location", "Medium", "Investigating", "Automated Alert"),
        ("DDoS attack on public API", "High", "Resolved", "SOC Analyst 2")
    ]
    conn.executemany(
        "INSERT INTO incidents (title, severity, status, reported_by) VALUES (?, ?, ?, ?)",
        incidents
    )

    conn.commit()
    conn.close()
    print("Seeding complete!")

if __name__ == "__main__":
    seed_new_tables()
