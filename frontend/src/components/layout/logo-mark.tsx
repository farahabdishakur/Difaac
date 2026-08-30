import { Link } from 'react-router-dom'

/**
 * The Difaac wordmark.
 *
 * `logo-mark.png` is derived from the supplied artwork: cropped to the mark and
 * keyed to transparency. The original was a JPEG — no alpha — with its
 * near-black ground baked in and roughly 60% empty padding around the mark, so
 * any CSS height rendered a mark less than half that size, and the ground
 * showed as a faint rectangle wherever the page colour differed.
 *
 * With alpha, the mark now sits on any surface, which is what lets the header
 * be transparent over the hero.
 *
 * width/height are the real intrinsic dimensions. Declaring them lets the
 * browser reserve the correct space before the image loads, so the header does
 * not shift as the page settles.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`flex items-center transition-opacity hover:opacity-85 ${className ?? ''}`}
      aria-label="Difaac home"
    >
      <img
        src="/logo-mark.png"
        alt="Difaac"
        width={466}
        height={128}
        // Eager and high priority: this is above the fold on every page, and a
        // late-loading logo is the most visible kind of layout jank.
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="h-7 w-auto object-contain sm:h-8 lg:h-9"
      />
    </Link>
  )
}
