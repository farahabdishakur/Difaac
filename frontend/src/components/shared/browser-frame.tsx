import { toneRing } from '@/lib/tone'
import type { Tone } from '@/lib/tone'

/**
 * A real product screenshot, framed as a browser window — dots, an address
 * bar — so it reads unmistakably as "here is the product running" rather
 * than decorative art. Shared by the product pages and the homepage, so both
 * present the workspace the same way.
 */
export function BrowserFrame({ tone, image, path }: { tone: Tone; image: string; path: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border bg-ink-2 shadow-2xl ${toneRing[tone]}`}>
      <div className="flex items-center gap-2 border-b border-line-soft bg-ink-3 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </span>
        <span className="ml-2 flex-1 truncate rounded-md bg-ink px-3 py-1 text-center font-mono text-xs text-muted-2 sm:text-left">
          difaac.io{path}
        </span>
      </div>
      <img src={image} alt="" className="block w-full" loading="lazy" />
    </div>
  )
}
