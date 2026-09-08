import { useState } from 'react'
import type { Founder } from '@/lib/data/company'
function Portrait({ photo, name }: { photo?: string; name: string }) {
  const [broken, setBroken] = useState(false)

  if (!photo || broken) {
    return (
      <div className="mx-auto flex aspect-square w-full max-w-[210px] items-center justify-center rounded-xl bg-ink-3 border border-white/10">
        <span className="font-display text-4xl font-medium text-brand/60" aria-hidden="true">
          {name[0]}
        </span>
      </div>
    )
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[210px] overflow-hidden rounded-xl border border-white/10 bg-[#070a13] shadow-md">
      <img
        src={photo}
        alt={`${name} — Difaac`}
        onError={() => setBroken(true)}
        width={400}
        height={400}
        className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        loading="lazy"
      />
    </div>
  )
}

export function PersonGrid({ people }: { people: Founder[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {people.map((person) => (
        <div
          key={person.name}
          className="group flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0c1017] p-6 text-center transition-all duration-300 hover:border-white/20 hover:bg-[#0f141d] shadow-lg"
        >
          <Portrait photo={person.photo} name={person.name} />

          <div className="mt-5 flex items-center justify-center gap-1.5">
            <h3 className="font-display text-base sm:text-lg font-medium tracking-tight text-white group-hover:text-brand transition-colors">
              {person.name}
            </h3>
            {person.linkedin && (
              <a
                href={person.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`${person.name} on LinkedIn`}
                className="tap-target inline-flex size-4 items-center justify-center rounded-[3px] bg-[#333842] text-[#9ca3af] hover:bg-[#0077b5] hover:text-white transition-colors"
                title="LinkedIn Profile"
              >
                <svg className="size-2.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            )}
          </div>

          <p className="mt-1 text-xs sm:text-sm text-[#94a3b8] font-normal leading-normal">
            {person.role}
          </p>
        </div>
      ))}
    </div>
  )
}
