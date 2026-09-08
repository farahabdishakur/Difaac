Difaac team portraits
======================

Square, 400 x 400, JPG. The grid crops to 1:1 and rounds the corners by 8px,
matching the portrait treatment on group-ib.com/team.

Why square, and why the same square every time: a team grid reads as one team
only when every face sits at roughly the same size and the same height in its
frame. Photos taken on different phones at different distances do not do that
on their own, so they are cropped to match before they go in here — not left to
object-fit to sort out.

The crop is done by scripts/portraits/make_portraits.py (see its header for
the two numbers that describe each crop). Re-run it when a photo changes; the
contact sheet it writes is there to be looked at, because a face cut at the
chin is obvious on the sheet and invisible in code.

Files are named after the person, lowercase, no spaces:

  farah.jpg
  sharmaarke.jpg
  khaalid.jpg
  ...

They are wired up in frontend/src/lib/data/company.ts. A portrait with no file
shows a monogram instead, so a missing photo never renders as a broken image.
