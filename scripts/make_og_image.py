"""Compose the social share card at frontend/public/og-image.png.

When difaac.com is pasted into WhatsApp, LinkedIn or a Slack channel, this is
the picture that appears beside it. Without one the link renders as a bare grey
box, which for a security company reads as a site nobody finished.

Built from the brand assets already in public/ rather than typeset here: the
logo carries the mark and the wordmark, so nothing has to be rendered in a font
that may not exist on the machine running this. The ground is the same ink and
the same brand green the site uses, mixed the same way the hero is.

    python scripts/make_og_image.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

REPO = Path(__file__).resolve().parents[1]
PUBLIC = REPO / "frontend" / "public"

# The size every platform crops from. Anything smaller is upscaled and looks it.
W, H = 1200, 630
INK = (1, 0, 5)
BRAND = (0, 201, 121)


def main() -> None:
    card = Image.new("RGB", (W, H), INK)

    # The same off-centre wash the hero uses: a glow from the upper left, so
    # the panel is not a flat rectangle, and the logo sits in the light.
    glow = Image.new("RGB", (W, H), INK)
    draw = ImageDraw.Draw(glow)
    for radius, strength in ((520, 0.30), (360, 0.22), (200, 0.14)):
        fill = tuple(int(INK[i] + (BRAND[i] - INK[i]) * strength) for i in range(3))
        draw.ellipse(
            (140 - radius, 200 - radius, 140 + radius, 200 + radius), fill=fill
        )
    card = Image.blend(card, glow.filter(ImageFilter.GaussianBlur(150)), 0.85)

    # logo-mark.png, not logo.png: the latter is the mark already sitting on an
    # opaque ink rectangle, which lands on this ground as a visible black box.
    logo = Image.open(PUBLIC / "logo-mark.png").convert("RGBA")
    target_w = 620
    logo = logo.resize(
        (target_w, round(logo.height * target_w / logo.width)), Image.LANCZOS
    )
    card.paste(logo, ((W - logo.width) // 2, (H - logo.height) // 2 - 20), logo)

    # A brand rule under the mark: one line, the only other element on the card.
    rule = ImageDraw.Draw(card)
    y = (H - logo.height) // 2 + logo.height + 26
    rule.rectangle((W // 2 - 90, y, W // 2 + 90, y + 3), fill=BRAND)

    out = PUBLIC / "og-image.png"
    card.save(out, "PNG", optimize=True)
    print(f"{out.relative_to(REPO)}  {W}x{H}  {out.stat().st_size // 1024} kB")


if __name__ == "__main__":
    main()
