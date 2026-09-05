import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getIcon } from '@/components/icons/icon-map'
import { ProductEmblem } from '@/components/product/product-emblem'
import { IndustryEmblem } from '@/components/industry/industry-emblem'
import { productAccent } from '@/lib/tone'
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
// The panel hangs off the header with no height of its own, so on a short
// window a long menu (Services carries four groups) simply ran past the bottom
// of the screen with its last group unreachable — the page cannot be scrolled
// to reach an absolutely positioned panel, and moving the pointer away to try
// closes it. Capping it to the space below the header and letting it scroll
// internally is what makes every entry reachable at any window height.
const panelBase =
  'absolute left-1/2 top-full z-40 w-screen -translate-x-1/2 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain border-x border-b border-line border-t-2 border-t-brand bg-ink-2 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.9)] transition-[opacity,transform] duration-150 ease-out'

function visibility(isOpen: boolean) {
  return isOpen
    ? 'pointer-events-auto translate-y-0 opacity-100'
    : 'pointer-events-none -translate-y-1 opacity-0'
}

const eyebrowClass = 'text-[11px] font-medium uppercase tracking-[0.16em] text-muted-2'

/** Which set of rendered emblems a panel's entries draw from, if any. */
type EmblemKind = 'product' | 'industry'

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
 *
 * Products and Industries are the exceptions: those entries get the same
 * glass emblem their own page uses instead of the flat tile — the mega-menu
 * is often the first place a visitor sees one, so it should look like the
 * page it leads to.
 */
function MenuItem({ item, emblem }: { item: MenuEntry; emblem?: EmblemKind }) {
  const Icon = getIcon(item.icon)

  return (
    <Link
      to={item.href}
      className="group/item flex items-start gap-3 rounded-[4px] p-3 transition-colors hover:bg-ink-3"
    >
      {emblem === 'product' ? (
        <ProductEmblem
          icon={Icon}
          tone={productAccent[item.key] ?? 'brand'}
          slug={item.key}
          size="menu"
          className="-my-1"
        />
      ) : emblem === 'industry' ? (
        <IndustryEmblem icon={Icon} slug={item.key} size="menu" className="-my-1" />
      ) : (
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[4px] border border-line bg-ink-2 text-brand transition-colors group-hover/item:border-brand/50 group-hover/item:bg-brand-ink">
          <Icon className="size-4" aria-hidden="true" strokeWidth={1.6} />
        </span>
      )}
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
        {feature.image ? (
          <span className="relative -ml-1.5 -mt-1.5 flex size-14 shrink-0 items-center justify-center">
            <span
              className="pointer-events-none absolute inset-0 scale-125 rounded-full bg-brand opacity-40 blur-2xl"
              aria-hidden="true"
            />
            <img src={feature.image} alt="" className="relative size-full object-contain" loading="eager" />
          </span>
        ) : (
          <span className="flex size-10 items-center justify-center rounded-[4px] border border-brand/40 bg-brand-ink text-brand">
            <Icon className="size-5" aria-hidden="true" strokeWidth={1.6} />
          </span>
        )}
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

/**
 * The grouped section of a panel, below its main list.
 *
 * How the groups are laid out depends on how many there are, because the two
 * cases fail in opposite directions. Services carries four small groups
 * (Response, Investigation, Training); stacking those vertically, each with
 * its own heading and rule, was what pushed the panel past the bottom of a
 * short window — side by side they cost one block's height instead of three.
 * Solutions carries a single group of six; giving that one a column of its
 * own would make it six rows tall, so it keeps the wide grid.
 */
function PanelGroups({ panel, emblem }: { panel: MenuPanel; emblem?: EmblemKind }) {
  const groups = panel.groups ?? []
  const sideBySide = groups.length > 1
  const gridCols = panel.columns === 3 ? 'grid-cols-3' : 'grid-cols-2'

  return (
    <div
      className={cn(
        'mt-5 border-t border-line-soft pt-5',
        sideBySide && 'grid gap-x-4 gap-y-6 grid-cols-3',
      )}
    >
      {groups.map((group) => (
        <div key={group.title} className={sideBySide ? '' : 'mt-5 first:mt-0'}>
          <span className={eyebrowClass}>{group.title}</span>
          <div
            className={cn(
              'mt-3',
              sideBySide ? 'flex flex-col gap-0.5' : cn('grid gap-x-4 gap-y-1', gridCols),
            )}
          >
            {group.items.map((item) => (
              <MenuItem key={item.key} item={item} emblem={emblem} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Panel({
  panel,
  isOpen,
  width,
  emblem,
}: {
  panel: MenuPanel
  isOpen: boolean
  width: string
  emblem?: EmblemKind
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
              <MenuItem key={item.key} item={item} emblem={emblem} />
            ))}
          </div>

          {panel.groups?.length ? <PanelGroups panel={panel} emblem={emblem} /> : null}
        </div>
      </div>
    </div>
  )
}

export function ProductsMegaMenu({ isOpen }: { isOpen: boolean }) {
  return <Panel panel={productsMenu} isOpen={isOpen} width="max-w-[1040px]" emblem="product" />
}

export function IndustriesMegaMenu({ isOpen }: { isOpen: boolean }) {
  return <Panel panel={industriesMenu} isOpen={isOpen} width="max-w-[1040px]" emblem="industry" />
}

// Solutions and Services list far more entries than the other panels, so they
// get the extra width that lets those entries sit in three columns instead of
// two — the same content in noticeably fewer rows.
export function SolutionsMegaMenu({ isOpen }: { isOpen: boolean }) {
  return <Panel panel={solutionsMenu} isOpen={isOpen} width="max-w-[1180px]" />
}

export function ServicesMegaMenu({ isOpen }: { isOpen: boolean }) {
  return <Panel panel={servicesMenu} isOpen={isOpen} width="max-w-[1180px]" />
}

/**
 * Company is not a mega-menu.
 *
 * group-ib.com's smaller sections drop a plain vertical list of links rather
 * than the featured panel the product menus use — a short set of destinations
 * does not need a feature block or descriptions to be scannable, and a full
 * panel over five names reads as scaffolding with nothing to hold up. This is
 * that list: the entries stacked, names only, anchored under the Company item
 * rather than spanning the viewport.
 */
export function CompanyDropdown({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={cn(
        'absolute left-0 top-full z-40 mt-2 w-60 overflow-hidden rounded-b-md border border-line border-t-2 border-t-brand bg-ink-2 py-2 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.9)] transition-[opacity,transform] duration-150 ease-out',
        visibility(isOpen),
      )}
      inert={!isOpen}
    >
      {companyMenu.items.map((item) => (
        <Link
          key={item.key}
          to={item.href}
          className="block px-5 py-2.5 text-sm font-medium text-body transition-colors hover:bg-ink-3 hover:text-brand"
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}
