import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoMark } from '@/components/layout/logo-mark'
import { MobileNav } from '@/components/layout/mobile-nav'
import { SearchOverlay } from '@/components/layout/search-overlay'
import { useAuthUser } from '@/hooks/use-auth'
import {
  ProductsMegaMenu,
  IndustriesMegaMenu,
  SolutionsMegaMenu,
  ServicesMegaMenu,
  CompanyDropdown,
} from '@/components/layout/mega-menu'

const navItems = [
  { key: 'products', label: 'Products', href: null },
  { key: 'industries', label: 'Industries', href: null },
  { key: 'solutions', label: 'Solutions', href: null },
  { key: 'services', label: 'Services', href: null },
  { key: 'subscriptions', label: 'Pricing', href: '/subscriptions' },
  { key: 'company', label: 'Company', href: null },
  { key: 'talk-to-sales', label: "Let's Talk", href: '/talk-to-sales' },
] as const

type NavKey = (typeof navItems)[number]['key']

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<NavKey | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { pathname } = useLocation()
  const user = useAuthUser()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Escape closes an open dropdown, matching native menu behaviour.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenMenu(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Navigating from inside a panel should dismiss it.
  useEffect(() => {
    setOpenMenu(null)
  }, [pathname])

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  function openNav(key: NavKey) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(key)
  }

  /** Keyboard and touch entry point — hover alone leaves both out. */
  function toggleNav(key: NavKey) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu((current) => (current === key ? null : key))
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        // Transparent while the hero is in view so the header sits on the
        // artwork rather than cutting a band across it. A background only
        // appears once content would otherwise scroll underneath and make the
        // navigation unreadable. A menu being open counts too: the panel needs
        // an opaque bar above it.
        scrolled || openMenu
          ? 'glass-header'
          : 'border-b border-transparent bg-transparent'
      }`}
      onMouseLeave={scheduleClose}
    >
      {/*
        Three tracks: logo, navigation, actions.

        The outer two both take `flex-1`, so they always resolve to the same
        width whatever they contain. That is what keeps the navigation optically
        centred in the bar — a fixed width on each side would only look centred
        until one side outgrew it, and `ml-auto` on the right centres nothing at
        all, it just pushes.
      */}
      <div className="relative mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:h-16 lg:gap-4 lg:px-8 xl:gap-8">
        <div className="flex flex-1 items-center justify-start">
          <LogoMark />
        </div>

        {/*
          Padding lives on each item rather than in the gap, so hover and active
          targets touch and the group reads as one navigation block.
        */}
        <nav aria-label="Primary" className="hidden shrink-0 items-center justify-center lg:flex">
          {navItems.map((item) => (
            <div key={item.key} className={item.key === 'company' ? 'relative' : 'static'} onMouseEnter={() => openNav(item.key)}>
              {item.href ? (
                <Link
                  to={item.href}
                  className={`group relative px-3 py-2 text-sm font-medium transition-colors xl:px-3.5 ${
                    openMenu === item.key ? 'text-brand' : 'text-body hover:text-text'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-[14px] left-3 h-[2px] w-[calc(100%-1.5rem)] bg-brand transition-transform duration-300 ease-out ${
                      openMenu === item.key ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleNav(item.key)}
                  className={`group relative px-3 py-2 text-sm font-medium transition-colors xl:px-3.5 ${
                    openMenu === item.key ? 'text-brand' : 'text-body hover:text-text'
                  }`}
                  aria-expanded={openMenu === item.key}
                  aria-haspopup="true"
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-[14px] left-3 h-[2px] w-[calc(100%-1.5rem)] bg-brand transition-transform duration-300 ease-out ${
                      openMenu === item.key ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              )}
              {item.key === 'products' ? <ProductsMegaMenu isOpen={openMenu === 'products'} /> : null}
              {item.key === 'industries' ? <IndustriesMegaMenu isOpen={openMenu === 'industries'} /> : null}
              {item.key === 'solutions' ? <SolutionsMegaMenu isOpen={openMenu === 'solutions'} /> : null}
              {item.key === 'services' ? <ServicesMegaMenu isOpen={openMenu === 'services'} /> : null}
              {item.key === 'company' ? <CompanyDropdown isOpen={openMenu === 'company'} /> : null}
            </div>
          ))}
        </nav>

        {/* Mirrors the logo track's flex-1 so both sides measure the same. */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="text-body hover:text-brand hover:bg-brand/10 transition-colors"
          >
            <Search className="size-4.5" aria-hidden="true" />
          </Button>
          <Link
            to={user ? '/workspace' : '/sign-in'}
            className="hidden text-sm font-medium text-body transition-colors hover:text-brand lg:inline-block px-1"
          >
            {user ? 'Workspace' : 'Sign in'}
          </Link>
          <MobileNav />
        </div>
      </div>
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
