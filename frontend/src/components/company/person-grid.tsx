import { useState } from 'react'
import type { Founder } from '@/lib/data/company'

/**
 * The leadership portrait grid, built the way group-ib.com's team page builds
 * it: a photograph, then a name and a role beneath it, three across.
 *
 * The one honest departure is the fallback. A portrait that has not been
 * supplied yet shows a monogram rather than a stock face — Difaac's own
 * principles rule out putting an invented person in front of anyone. Drop a
 * real photo at the path in the data (e.g. /public/team/farah.jpg) and it
 * replaces the monogram with no code change; if the file is missing or fails
 * to load, the card falls back on its own.
 */
function Portrait({ photo, name }: { photo?: string; name: string }) {
  // Start in the fallback state when there is no path at all, and drop back to
  // it if a path is given but the image cannot be loaded.
  const [broken, setBroken] = useState(false)

  if (!photo || broken) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-line bg-ink-3">
        <span className="font-display text-5xl font-normal text-brand/70" aria-hidden="true">
          {name[0]}
        </span>
      </div>
    )
  }

  return (
    <img
      src={photo}
      alt={`${name}, Difaac`}
      onError={() => setBroken(true)}
      className="aspect-[4/5] w-full rounded-2xl border border-line object-cover object-center"
      loading="lazy"
    />
  )
}

export function PersonGrid({ people }: { people: Founder[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => (
        <figure key={person.name} className="flex flex-col gap-4">
          <Portrait photo={person.photo} name={person.name} />
          <figcaption>
            <span className="block font-display text-lg font-medium text-text">{person.name}</span>
            <span className="block text-sm text-brand">{person.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
