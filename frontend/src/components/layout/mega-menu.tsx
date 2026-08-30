import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getIcon } from '@/components/icons/icon-map'
import {
  productsMenu,
  industriesMenu,
  solutionsMenu,
  servicesMenu,
  companyMenu,
  type MenuEntry,
  type MenuPanel,
} from '@/lib/data/mega-menu'
import { cn } from '@/lib/utils'

/**
 * Navigation dropdowns.
 *
 * All five render through one `Panel`, so a change to spacing, hover treatment
 * or icon size lands everywhere at once. Previously each menu had its own
 * markup and they had drifted: Services carried no icons or descriptions and
 * Company was a bare list of labels, which made the same navigation feel like
 * it came from different sites depending on which item you hovered.
 *
 * Panels stay mounted so they can transition, and are marked `inert` while
 * closed so their links leave the tab order and the accessibility tree.
 */
const panelBase =
  'absolute left-1/2 top-full z-40 w-screen -translate-x-1/2 border-x border-b border-line border-t-2 border-t-brand bg-ink-2 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.9)] transition-[opacity,transform] duration-150 ease-out'

function visibility(isOpen: boolean) {
  return isOpen
    ? 'pointer-events-auto translate-y-0 opacity-100'
    : 'pointer-events-none -translate-y-1 opacity-0'
}

const eyebrowClass = 'text-[11px] font-medium uppercase tracking-[0.16em] text-muted-2'

function MenuLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group/link inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-bright"
    >
      {children}
      <ArrowRight
        className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  )
}

/**
 * One navigable entry.
 *
 * The icon sits in a bordered tile that fills with the brand colour on hover,
 * which gives the whole row a single obvious hit state rather than only the
 * label changing colour.
 */
function MenuItem({ item }: { item: MenuEntry }) {
  const Icon = getIcon(item.icon)

  return (
    <Link
      to={item.href}
      className="group/item flex items-start gap-3 rounded-[4px] p-3 transition-colors hover:bg-ink-3"
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[4px] border border-line bg-ink-2 text-brand transition-colors group-hover/item:border-brand/50 group-hover/item:bg-brand-ink">
        <Icon className="size-4" aria-hidden="true" strokeWidth={1.6} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text transition-colors group-hover/item:text-brand">
          {item.name}
        </span>
        <span className="text-xs leading-snug text-muted-2">{item.tagline}</span>
      </span>
    </Link>
  )
}

/** Left-hand block: what this section of the site is for. */
function Feature({ feature }: { feature: MenuPanel['feature'] }) {
  const Icon = getIcon(feature.icon)

  return (
    <div className="flex flex-col justify-between gap-8 border-r border-line-soft bg-ink-3 p-7">
      <div className="flex flex-col gap-4">
        <span className="flex size-10 items-center justify-center rounded-[4px] border border-brand/40 bg-brand-ink text-brand">
          <Icon className="size-5" aria-hidden="true" strokeWidth={1.6} />
        </span>
        <div className="flex flex-col gap-2">
          <span className={eyebrowClass}>{feature.eyebrow}</span>
          <span className="font-display text-base font-semibold text-text">{feature.title}</span>
          <span className="text-sm leading-relaxed text-body">{feature.description}</span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 border-t border-line-soft pt-5">
        {feature.links.map((link) => (
          <MenuLink key={link.href} to={link.href}>
            {link.label}
          </MenuLink>
        ))}
      </div>
    </div>
  )
}

function Panel({
  panel,
  isOpen,
  width,
}: {
  panel: MenuPanel
  isOpen: boolean
  width: string
}) {
  return (
    <div className={cn(panelBase, width, visibility(isOpen))} inert={!isOpen}>
      <div className="grid grid-cols-[290px_1fr]">
        <Feature feature={panel.feature} />

        <div className="p-7">
          <span className={eyebrowClass}>{panel.eyebrow}</span>
          <div
            className={cn(
              'mt-4 grid gap-x-4 gap-y-1',
              panel.columns === 3 ? 'grid-cols-3' : 'grid-cols-2',
            )}
          >
            {panel.items.map((item) => (
              <MenuItem key={item.key} item={item} />
            ))}
          </div>

          {panel.groups?.map((group) => (
            <div key={group.title} className="mt-6 border-t border-line-soft pt-5">
              <span className={eyebrowClass}>{group.title}</span>
              <div
                className={cn(
                  'mt-4 grid gap-x-4 gap-y-1',
                  panel.columns === 3 ? 'grid-cols-3' : 'grid-cols-2',
                )}
              >
                {group.items.map((item) => (
                  <MenuItem key={item.key} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProductsMegaMenu({ isOpen }: { isOpen: boolean }) {
  return <Panel panel={productsMenu} isOpen={isOpen} width="max-w-[1040px]" />
}

export function IndustriesMegaMenu({ isOpen }: { isOpen: boolean }) {
  return <Panel panel={industriesMenu} isOpen={isOpen} width="max-w-[1040px]" />
}

export function SolutionsMegaMenu({ isOpen }: { isOpen: boolean }) {
  return <Panel panel={solutionsMenu} isOpen={isOpen} width="max-w-[1040px]" />
}

export function ServicesMegaMenu({ isOpen }: { isOpen: boolean }) {
  return <Panel panel={servicesMenu} isOpen={isOpen} width="max-w-[1040px]" />
}

export function CompanyDropdown({ isOpen }: { isOpen: boolean }) {
  return <Panel panel={companyMenu} isOpen={isOpen} width="max-w-[880px]" />
}
