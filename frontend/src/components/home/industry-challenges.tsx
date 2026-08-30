import { AlertCircle } from 'lucide-react'

interface Challenge {
  title: string
  description: string
}

interface IndustryChallengesProps {
  challenges: Challenge[]
}

export function IndustryChallenges({ challenges }: IndustryChallengesProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-xs font-medium text-brand">
            Industry Challenges
          </span>
          <h2 className="mt-6 font-display text-[clamp(28px,4vw,42px)] font-bold leading-tight text-text">
            Threats unique to your industry
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {challenges.map((challenge, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-4 rounded-lg border border-line-soft bg-gradient-to-br from-brand-ink/20 to-transparent p-8 transition-all duration-200 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-brand/20 p-3">
                  <AlertCircle className="size-6 text-brand" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-text">{challenge.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{challenge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
