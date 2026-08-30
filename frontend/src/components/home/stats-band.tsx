const stats = [
  { value: '700+', label: 'Threat actor groups tracked' },
  { value: '70+', label: 'Countries feeding sensor telemetry' },
  { value: 'Under 15 min', label: 'Response time for critical incidents' },
  { value: '24/7', label: 'Analyst-staffed SOC coverage' },
]

export function StatsBand() {
  return (
    <section className="bg-ink-2 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-px bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2 bg-ink-2 p-6 lg:p-8">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="flex flex-col gap-2">
                <span className="font-display text-3xl font-semibold tracking-tight text-text lg:text-4xl">
                  {stat.value}
                </span>
                <span className="text-sm leading-relaxed text-muted-2">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}


