import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getIcon } from '@/components/icons/icon-map'
import { ProductEmblem } from '@/components/product/product-emblem'
import { productAccent } from '@/lib/tone'
import { products } from '@/lib/data/products'
import { services } from '@/lib/data/services'
import { solutions } from '@/lib/data/solutions'
import { industries } from '@/lib/data/industries'

/**
 * Products / Services / Solutions switcher.
 *
 * group-ib.com follows its hero with three tabs that switch a panel beneath
 * them without leaving the page: a product tab of rendered cards, a
 * services/solutions tab of plain grouped link columns. That structure, not
 * their copy or their literal colours, is what is reproduced here: the
 * panels are built from Difaac's own product, service, solution, and
 * industry catalogues, so adding an entry to any of those data files is
 * enough to add it here too.
 */

type TabKey = 'products' | 'services' | 'solutions'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'products', label: 'Products' },
  { key: 'services', label: 'Services' },
  { key: 'solutions', label: 'Solutions' },
]

const serviceGroups: { title: string; group: (typeof services)[number]['group'] }[] = [
  { title: 'Assessment', group: 'assessment' },
  { title: 'Response', group: 'response' },
  { title: 'Investigation', group: 'investigation' },
  { title: 'Training', group: 'training' },
]

/** A plain link list under a column heading, shared by the Services and Solutions panels. */
function LinkColumn({ title, items }: { title: string; items: { name: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-2">{title}</span>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link to={item.href} className="text-sm text-body transition-colors hover:text-brand">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProductsPanel() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {products.map((product) => {
        const Icon = getIcon(product.icon)
        const tone = productAccent[product.slug] ?? 'brand'
        return (
          <Link
            key={product.slug}
            to={`/products/${product.slug}`}
            className="group flex flex-col items-center gap-4 rounded-2xl border border-line bg-ink-2/60 px-4 py-8 text-center transition-colors hover:border-brand/50 hover:bg-ink-3"
          >
            <ProductEmblem icon={Icon} tone={tone} slug={product.slug} size="card" />
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-text">{product.tagline}</span>
              <span className="text-xs text-muted-2">{product.name}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function ServicesPanel() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
      {serviceGroups.map(({ title, group }) => (
        <LinkColumn
          key={group}
          title={title}
          items={services
            .filter((s) => s.group === group)
            .map((s) => ({ name: s.name, href: `/services/${s.slug}` }))}
        />
      ))}
    </div>
  )
}

function SolutionsPanel() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
      <LinkColumn
        title="By use case"
        items={solutions.filter((s) => s.group === 'use-case').map((s) => ({ name: s.name, href: `/solutions/${s.slug}` }))}
      />
      <LinkColumn
        title="By role"
        items={solutions.filter((s) => s.group === 'role').map((s) => ({ name: s.name, href: `/solutions/${s.slug}` }))}
      />
      <LinkColumn
        title="By industry"
        items={industries.map((i) => ({ name: i.name, href: `/industries/${i.slug}` }))}
      />
    </div>
  )
}

const panels: Record<TabKey, () => React.ReactElement> = {
  products: ProductsPanel,
  services: ServicesPanel,
  solutions: SolutionsPanel,
}

export function PlatformTabsSection() {
  const [active, setActive] = useState<TabKey>('products')
  const ActivePanel = panels[active]

  return (
    <section className="bg-ink-2 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance font-display font-medium leading-[1.15] text-text t-h2">
            Powering cybersecurity intelligence with the{' '}
            <span className="bg-gradient-to-r from-brand via-brand-bright to-brand-ultra bg-clip-text text-transparent">
              Difaac Unified Risk Platform
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-body sm:text-lg">
            Difaac maps the threat actors targeting your organisation and tunes your defenses around
            them. Adversary intelligence sits at the core of every product, so a signal caught in one
            area strengthens detection everywhere else.
          </p>
        </div>

        <div className="mx-auto mt-10 grid grid-cols-3 gap-3 sm:max-w-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              aria-pressed={active === tab.key}
              className={`rounded-xl border px-4 py-4 text-sm font-medium transition-colors sm:text-base ${
                active === tab.key
                  ? 'border-brand/50 bg-ink-3 text-text'
                  : 'border-line bg-ink/60 text-muted-2 hover:border-line-soft hover:text-body'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <ActivePanel />
        </div>

        <div className="mt-10 border-t border-line-soft pt-8 text-center">
          <Link
            to="/products"
            className="tap-target group inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-bright"
          >
            Learn more about the Difaac Unified Risk Platform
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
