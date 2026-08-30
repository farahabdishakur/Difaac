/**
 * Per-product hero artwork.
 *
 * Each product gets a graphic that depicts what it actually does, so the hero
 * carries meaning rather than decoration. Drawn as inline SVG rather than
 * shipped as an image: it stays crisp at any size, inherits the brand tokens so
 * a colour change flows through automatically, and costs no extra request.
 *
 * `aria-hidden` throughout — the headline beside it already says what the
 * product is, and narrating a decorative diagram would only add noise.
 */

/**
 * Threat Intelligence: an actor-attribution graph.
 *
 * A central tracked actor, its infrastructure radiating outward, and the
 * observed links between them — the shape an analyst actually sees when pivoting
 * through intelligence. Node sizes vary by degree so the graph reads as real
 * data rather than an evenly spaced decoration.
 */
function ThreatIntelligenceArt() {
  // Laid out by hand rather than generated, so the composition stays balanced
  // instead of drifting when a node moves.
  const nodes = [
    { id: 'core', x: 210, y: 175, r: 15, kind: 'core' },
    { id: 'a', x: 96, y: 92, r: 7, kind: 'infra' },
    { id: 'b', x: 330, y: 88, r: 6, kind: 'infra' },
    { id: 'c', x: 62, y: 214, r: 8, kind: 'infra' },
    { id: 'd', x: 348, y: 226, r: 7, kind: 'infra' },
    { id: 'e', x: 168, y: 292, r: 6, kind: 'infra' },
    { id: 'f', x: 268, y: 300, r: 5, kind: 'infra' },
    { id: 'g', x: 300, y: 152, r: 4, kind: 'leaf' },
    { id: 'h', x: 122, y: 158, r: 4, kind: 'leaf' },
    { id: 'i', x: 396, y: 148, r: 3, kind: 'leaf' },
    { id: 'j', x: 30, y: 130, r: 3, kind: 'leaf' },
    { id: 'k', x: 226, y: 60, r: 4, kind: 'leaf' },
  ] as const

  const edges: [string, string][] = [
    ['core', 'a'], ['core', 'b'], ['core', 'c'], ['core', 'd'],
    ['core', 'e'], ['core', 'f'], ['core', 'g'], ['core', 'h'],
    ['a', 'j'], ['a', 'k'], ['b', 'i'], ['b', 'g'],
    ['c', 'h'], ['d', 'f'], ['e', 'c'],
  ]

  const at = (id: string) => nodes.find((n) => n.id === id)!

  return (
    <svg
      viewBox="0 0 420 350"
      className="h-auto w-full"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ti-core-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.42" />
          <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ti-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-accent-cyan)" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Reference rings, to read as a radar sweep rather than a flat diagram */}
      {[68, 116, 164].map((r) => (
        <circle
          key={r}
          cx={210}
          cy={175}
          r={r}
          fill="none"
          stroke="var(--color-brand)"
          strokeOpacity={0.09}
          strokeDasharray="2 7"
        />
      ))}

      <circle cx={210} cy={175} r={150} fill="url(#ti-core-glow)" />

      {edges.map(([from, to]) => {
        const a = at(from)
        const b = at(to)
        return (
          <line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="url(#ti-edge)"
            strokeWidth={from === 'core' ? 1.2 : 0.7}
          />
        )
      })}

      {nodes.map((n) => {
        if (n.kind === 'core') {
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={n.r + 9} fill="var(--color-brand)" fillOpacity={0.14} />
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill="var(--color-brand)"
                stroke="var(--color-brand-bright)"
                strokeWidth={1.5}
              />
            </g>
          )
        }
        const infra = n.kind === 'infra'
        return (
          <circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={infra ? 'var(--color-ink-3)' : 'transparent'}
            stroke={infra ? 'var(--color-brand)' : 'var(--color-accent-cyan)'}
            strokeOpacity={infra ? 0.85 : 0.6}
            strokeWidth={1.3}
          />
        )
      })}
    </svg>
  )
}

const artwork: Record<string, () => React.ReactElement> = {
  'threat-intelligence': ThreatIntelligenceArt,
}

/**
 * Returns the hero artwork for a product, or null when none is authored yet.
 *
 * Returning null rather than a generic fallback is deliberate: a product
 * without its own graphic keeps the plain centred hero, which looks
 * considered, whereas the same placeholder repeated across six pages looks
 * unfinished.
 */
export function ProductHeroArt({ slug }: { slug: string }) {
  const Art = artwork[slug]
  return Art ? <Art /> : null
}

export function hasHeroArt(slug: string): boolean {
  return slug in artwork
}
