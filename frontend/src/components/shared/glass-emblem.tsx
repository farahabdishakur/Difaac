import { toneVar } from '@/lib/tone'
import type { Tone } from '@/lib/tone'

/**
 * A rendered glass emblem on its own pool of accent light.
 *
 * Products and industries both ship real renders — a glass hexagon holding a
 * subject, standing on a glowing ring, keyed from its background to
 * transparent — and both want the same treatment: the artwork sat over a
 * blurred disc of its accent so the object appears to be lighting the page
 * rather than pasted onto it. That treatment lives here so the two sets stay
 * identical instead of drifting apart in opacity or blur.
 */
export function GlassEmblem({
  src,
  tone = 'brand',
  sizeClass,
  className,
  eager,
}: {
  src: string
  tone?: Tone
  sizeClass: string
  className?: string
  /** Set for an emblem above the fold, where the render is the first thing seen. */
  eager?: boolean
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${sizeClass} ${className ?? ''}`}
    >
      <span
        className="pointer-events-none absolute inset-0 scale-125 rounded-full opacity-45 blur-2xl"
        style={{ background: toneVar[tone] }}
        aria-hidden="true"
      />
      <img
        src={src}
        alt=""
        className="relative size-full object-contain"
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
      />
    </span>
  )
}
