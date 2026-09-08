"""Capture the product consoles for use on the marketing pages.

The product pages and the homepage showcase each carry a real screenshot of
the console that product ships, so a visitor sees the actual interface rather
than a mock-up. Those screenshots go stale whenever a dashboard changes, and
this regenerates them in one pass.

Credentials come from the environment, never from this file:

    set DIFAAC_CAPTURE_EMAIL=analyst@difaac.io
    set DIFAAC_CAPTURE_PASSWORD=...
    python backend/scripts/capture_console_screenshots.py

Requires Playwright and a running dev server. Playwright is a development-only
tool and is deliberately not in requirements.txt, so install it on demand:

    pip install playwright
"""

from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

# Resolve frontend/public/screenshots relative to repo root
REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = REPO_ROOT / "frontend" / "public" / "screenshots"
BASE = os.getenv("DIFAAC_CAPTURE_BASE", "https://localhost:5173")

# (workspace path, output filename)
CONSOLES = [
    ("/workspace/threat-intelligence", "workspace-threat-intelligence.png"),
    ("/workspace/fraud", "workspace-fraud.png"),
    ("/workspace/managed-xdr", "workspace-managed-xdr.png"),
    ("/workspace/attack-surface", "workspace-attack-surface.png"),
    ("/workspace/digital-risk", "workspace-digital-risk.png"),
    ("/workspace/email-protection", "workspace-email-protection.png"),
    ("/workspace/incidents", "workspace-incidents.png"),
]

# Clipped above the sidebar's account footer. These are public marketing
# images, not a place to publish a signed-in analyst's address.
CLIP = {"x": 0, "y": 0, "width": 1280, "height": 690}


async def main() -> None:
    email = os.getenv("DIFAAC_CAPTURE_EMAIL", "").strip()
    password = os.getenv("DIFAAC_CAPTURE_PASSWORD", "")
    if not email or not password:
        sys.exit(
            "Set DIFAAC_CAPTURE_EMAIL and DIFAAC_CAPTURE_PASSWORD before running this."
        )

    try:
        from playwright.async_api import async_playwright
    except ImportError:
        sys.exit("Playwright is not installed. Run: pip install playwright")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as p:
        # The system browser rather than a Playwright-managed download, so this
        # needs no extra several-hundred-megabyte install to run.
        browser = await p.chromium.launch(channel="msedge")
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            # The dev server runs on a locally-trusted certificate.
            ignore_https_errors=True,
        )
        page = await context.new_page()

        await page.goto(f"{BASE}/sign-in")
        await page.wait_for_load_state("networkidle")
        await page.fill("#email", email)
        await page.fill("#password", password)
        await page.click('button[type="submit"]')
        await page.wait_for_url(f"{BASE}/workspace*", timeout=15_000)

        for path, filename in CONSOLES:
            await page.goto(f"{BASE}{path}")
            await page.wait_for_load_state("networkidle")
            # Let the bars and dials finish their transition before capturing.
            await page.wait_for_timeout(700)
            await page.screenshot(path=str(OUT_DIR / filename), clip=CLIP)
            print(f"  {filename}")

        await browser.close()

    print(f"\n{len(CONSOLES)} console screenshots written to {OUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
