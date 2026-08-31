const stats = [
  {
    value: '700+',
    label: 'Threat actor groups',
    description: 'Continuously tracked and monitored globally',
  },
  {
    value: '70+',
    label: 'Countries monitored',
    description: 'Sensor telemetry feeds from around the world',
  },
  {
    value: '<15 min',
    label: 'Response time',
    description: 'Mean time to respond on critical incidents',
  },
  {
    value: '24/7',
    label: 'SOC coverage',
    description: 'Experienced analysts staffed around the clock',
  },
]

export function StatsBand() {
  return (
    <section className="bg-gradient-to-b from-ink to-ink-2 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-3 rounded-xl border border-brand/10 bg-white/[0.02] p-8 backdrop-blur-sm">
              <span className="font-display text-4xl font-bold tracking-tight text-brand lg:text-5xl">
                {stat.value}
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-text">{stat.label}</span>
                <span className="text-sm leading-relaxed text-body">{stat.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


