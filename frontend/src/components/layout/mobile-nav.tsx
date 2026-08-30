
import { Link } from 'react-router-dom'
import { Menu, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { LogoMark } from '@/components/layout/logo-mark'
import {
  productsMenu,
  industriesMenu,
  solutionsMenu,
  servicesMenu,
  type MenuPanel,
} from '@/lib/data/mega-menu'
import { companyLinks } from '@/lib/data/nav'

function MobileLinkList({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul className="flex flex-col gap-0.5 pb-2 pl-2">
      {items.map((item) => (
        <li key={item.href}>
          <SheetClose
            render={<Link to={item.href} />}
            nativeButton={false}
            className="flex items-center justify-between rounded-none px-3 py-2.5 text-sm text-body transition-colors hover:bg-ink-3 hover:text-text"
          >
            {item.label}
            <ChevronRight className="size-3.5 text-muted-2" aria-hidden="true" />
          </SheetClose>
        </li>
      ))}
    </ul>
  )
}

/** Flattens a navigation panel into the label/href pairs the mobile list needs. */
function panelLinks(panel: MenuPanel) {
  const entries = [...panel.items, ...(panel.groups?.flatMap((g) => g.items) ?? [])]
  return entries.map((item) => ({ label: item.name, href: item.href }))
}

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
        className="lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm border-line bg-ink p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-line-soft px-4 py-4">
          <SheetTitle>
            <LogoMark />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col overflow-y-auto px-2 py-4">
          <Accordion multiple defaultValue={[]}>
            <AccordionItem value="products">
              <AccordionTrigger className="px-3 text-sm font-semibold text-text">Products</AccordionTrigger>
              <AccordionContent>
                <MobileLinkList items={panelLinks(productsMenu)} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="industries">
              <AccordionTrigger className="px-3 text-sm font-semibold text-text">Industries</AccordionTrigger>
              <AccordionContent>
                <MobileLinkList items={panelLinks(industriesMenu)} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="solutions">
              <AccordionTrigger className="px-3 text-sm font-semibold text-text">Solutions</AccordionTrigger>
              <AccordionContent>
                <MobileLinkList items={panelLinks(solutionsMenu)} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="services">
              <AccordionTrigger className="px-3 text-sm font-semibold text-text">Services</AccordionTrigger>
              <AccordionContent>
                <MobileLinkList items={panelLinks(servicesMenu)} />
              </AccordionContent>
            </AccordionItem>
            <div className="py-1">
              <SheetClose
                render={<Link to="/subscriptions" />}
                nativeButton={false}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-brand hover:bg-ink-3 transition-colors"
              >
                <span>Subscription Plans</span>
                <ChevronRight className="size-4 text-brand" />
              </SheetClose>
            </div>

            <AccordionItem value="company">
              <AccordionTrigger className="px-3 text-sm font-semibold text-text">Company</AccordionTrigger>
              <AccordionContent>
                <MobileLinkList items={companyLinks} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-4 flex flex-col gap-2 border-t border-line-soft px-3 pt-4">
            <SheetClose
              render={<Link to="/talk-to-sales" />}
              nativeButton={false}
              className="flex h-11 items-center justify-center rounded-none bg-brand px-5 text-sm font-semibold text-brand-ink"
            >
              Let's Talk
            </SheetClose>
            <SheetClose
              render={<Link to="/sign-in" />}
              nativeButton={false}
              className="flex h-11 items-center justify-center rounded-none border border-line px-5 text-sm font-semibold text-text"
            >
              Sign in
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
