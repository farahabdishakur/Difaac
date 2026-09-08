Difaac team portraits
======================

Name each file after the person it shows, lowercase, words joined by hyphens:

  faarax-cabdi-shakuur-daahir.jpg
  sharmaarke-maxamed-jaamac.jpg

That is the whole wiring. The page derives the filename from the name in
frontend/src/lib/data/company.ts, so adding or replacing a photo means dropping
the file in here and nothing else. A name with no matching file shows a
monogram rather than a broken image, so a half-finished set still renders.

Square, 400 x 400, JPG. The grid crops to 1:1 and rounds the corners by 8px.

Why square, and why the same square every time: a team grid reads as one team
only when every face sits at roughly the same size and the same height in its
frame. Photos taken on different phones at different distances do not do that
on their own, so crop them to match before they go in here rather than leaving
it to object-fit.

scripts/portraits/make_portraits.py does that cropping and writes a contact
sheet beside the output. Look at the sheet: a face cut at the chin is obvious
there and invisible in code.

If one portrait needs to sit higher or lower than the rest, set
`objectPosition` on that person in company.ts — 'center 10%' pulls the crop up.
