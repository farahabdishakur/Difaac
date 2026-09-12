"""A stand-in for a hospital's record system, reporting to Difaac.

Set the key an admin issued (Settings -> Integration API keys) and run it; the
events show up in the Record Access console, and enough of them trip the
correlation rules into alerts on the Threat Intelligence console.

    DIFAAC_API_KEY=dfc_... python demo_hospital.py
    DIFAAC_API_KEY=dfc_... DIFAAC_URL=https://difaac.onrender.com python demo_hospital.py

Uses only the standard library, so there is nothing to install — the point is
that any language with an HTTP client can do this in a few lines.
"""

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

URL = os.environ.get("DIFAAC_URL", "https://difaac.onrender.com").rstrip("/")
KEY = os.environ.get("DIFAAC_API_KEY", "").strip()

# A believable few minutes at a ward: ordinary access, one denied export, and a
# burst of failed sign-ins — the last two are what the correlation rules catch.
EVENTS = [
    {"action": "record.view", "outcome": "success", "severity": "info", "actor": "dr.axmed", "subject_ref": "PATIENT-40318"},
    {"action": "record.view", "outcome": "success", "severity": "info", "actor": "nurse.amina", "subject_ref": "PATIENT-51120"},
    {"action": "record.update", "outcome": "success", "severity": "info", "actor": "dr.axmed", "subject_ref": "PATIENT-40318"},
    {"action": "record.export", "outcome": "denied", "severity": "high", "actor": "nurse.fadumo", "subject_ref": "PATIENT-99012"},
    *[{"action": "login.failed", "outcome": "failure", "severity": "medium", "actor": "unknown"} for _ in range(6)],
]


def main() -> int:
    if not KEY:
        print("Set DIFAAC_API_KEY first (Settings -> Integration API keys -> Generate).")
        return 2

    now = datetime.now(timezone.utc).isoformat()
    body = json.dumps({"events": [{"source": "banadir-ehr", "occurred_at": now, **e} for e in EVENTS]}).encode()
    req = urllib.request.Request(
        f"{URL}/api/ingest/events",
        data=body,
        headers={"X-API-Key": KEY, "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"{resp.status} {resp.read().decode()}")
    except urllib.error.HTTPError as exc:
        print(f"{exc.code} {exc.read().decode()}")
        return 1
    except urllib.error.URLError as exc:
        print(f"Could not reach {URL}: {exc.reason}")
        return 1

    print(f"Sent {len(EVENTS)} events. Open the Record Access console to see them,")
    print("and Threat Intelligence for the alerts correlation raised from them.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
