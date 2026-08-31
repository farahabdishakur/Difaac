import { SectionHeading } from '@/components/shared/section-heading'

export function PlatformOverview() {
  return (
    <section className="bg-ink py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main description */}
          <div className="lg:col-span-2">
            <SectionHeading
              eyebrow="The Platform"
              title="One unified risk platform"
              description="Difaac brings together threat intelligence, fraud detection, and managed incident response in a single platform — eliminating blind spots and enabling your team to move faster."
            />

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold text-text">Intelligence-Driven</h3>
                <p className="text-sm leading-relaxed text-body">
                  Every detection is grounded in threat intelligence and real-world attack patterns,
                  not just rule-based alerts.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-text">Human-Led</h3>
                <p className="text-sm leading-relaxed text-body">
                  Experienced analysts triage, validate, and guide response — technology scales the team,
                  not replaces it.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-text">Real-Time</h3>
                <p className="text-sm leading-relaxed text-body">
                  Detection and response happens as threats emerge, with mean response time under 15
                  minutes for critical incidents.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-text">Continuously Evolving</h3>
                <p className="text-sm leading-relaxed text-body">
                  Threats change daily — our platform adapts with new detections, tactics, and
                  countermeasures deployed continuously.
                </p>
              </div>
            </div>
          </div>

          {/* Stats highlight */}
          <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-ink via-brand-ink/40 to-transparent p-8 lg:col-span-1">
            <h3 className="font-semibold text-text mb-8">Why organizations choose Difaac</h3>
            <ul className="space-y-6">
              <li className="flex gap-3">
                <span className="text-2xl font-bold text-brand flex-shrink-0">700+</span>
                <span className="text-sm leading-relaxed text-body">Threat actor groups tracked in real time</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl font-bold text-brand flex-shrink-0">&lt;15m</span>
                <span className="text-sm leading-relaxed text-body">Response time for critical incidents</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl font-bold text-brand flex-shrink-0">24/7</span>
                <span className="text-sm leading-relaxed text-body">Analyst-staffed SOC coverage</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
