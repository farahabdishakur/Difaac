import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import { LogoMark } from '@/components/layout/logo-mark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getIcon } from '@/components/icons/icon-map'
import { ProductEmblem } from '@/components/product/product-emblem'
import { productAccent } from '@/lib/tone'
import { products } from '@/lib/data/products'
import { signIn } from '@/lib/auth'
import { useSeo } from '@/lib/seo'

/**
 * Sign in.
 *
 * Split screen: the platform on the left, the form on the right. The
 * reasoning is that this page is reached by two different people — a customer
 * signing in to work, and a prospect who followed a link and has never seen
 * the product. The right half serves the first in as few elements as
 * possible; the left half serves the second without getting in the way, by
 * showing what is behind the door rather than decorating it.
 *
 * The left panel is a lighter surface than the form so the two halves read as
 * distinct spaces, and it carries a real console screenshot rather than an
 * abstract graphic — the same screenshots the product pages use.
 */

/** Which console to show behind each product, and where its screenshot lives. */
const CONSOLE_IMAGE: Record<string, string> = {
  'threat-intelligence': '/screenshots/workspace-threat-intelligence.png',
  'fraud-protection': '/screenshots/workspace-fraud.png',
  'managed-xdr': '/screenshots/workspace-managed-xdr.png',
  'attack-surface-management': '/screenshots/workspace-attack-surface.png',
  'digital-risk-protection': '/screenshots/workspace-digital-risk.png',
  'business-email-protection': '/screenshots/workspace-email-protection.png',
}

function ProductShowcasePanel() {
  const [activeSlug, setActiveSlug] = useState(products[0].slug)
  const active = products.find((p) => p.slug === activeSlug) ?? products[0]

  return (
    // A lifted dark surface, against the near-black form panel. It has to be
    // lighter than the form side or the two halves merge into one wide page,
    // but only by enough to read as a separate space — the product is a dark
    // console, and a bright panel would put the loudest thing on the page
    // beside the one control the visitor came here to use.
    <div className="relative flex h-full flex-col justify-center overflow-hidden bg-gradient-to-br from-[#141a26] via-[#10151f] to-[#0b0f17] px-8 py-16 lg:px-14">
{/* The console, angled and bled off the edge, so it reads as the product sitting behind the copy. Decorative, so it stays out of the accessibility tree. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          key={active.slug}
          src={CONSOLE_IMAGE[active.slug]}
          alt=""
          className="absolute -right-32 top-1/2 w-[52rem] max-w-none -translate-y-1/2 rotate-[-16deg] rounded-2xl shadow-[0_40px_90px_-20px_rgba(0,0,0,0.45)] transition-opacity duration-500"
        />
{/* Fades the screenshot out from the left so the copy sits on clean surface, and softens it into the panel edge on the right. */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141a26] via-[#141a26]/80 to-transparent" />
      </div>

      <div className="relative max-w-lg">
        <h1 className="font-display t-display font-medium text-text">Products</h1>
        <p className="mt-4 text-pretty leading-relaxed text-body">
          Difaac&apos;s platform protects your infrastructure, your customers, and your name — built
          on adversary intelligence, correlated detection, and analyst-led response.
        </p>

        <ul className="mt-10 flex flex-col gap-1">
          {products.map((product) => {
            const isActive = product.slug === active.slug
            const tone = productAccent[product.slug] ?? 'brand'
            const Icon = getIcon(product.icon)

            return (
              <li key={product.slug}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveSlug(product.slug)}
                  onFocus={() => setActiveSlug(product.slug)}
                  onClick={() => setActiveSlug(product.slug)}
                  aria-expanded={isActive}
                  className={`w-full rounded-xl px-4 py-3 text-left transition-all ${
                    isActive
                      ? 'border border-white/10 bg-white/[0.06] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)] backdrop-blur-sm'
                      : 'border border-transparent hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <ProductEmblem
                      icon={Icon}
                      tone={tone}
                      slug={product.slug}
                      size="menu"
                      className="-my-1"
                    />
                    <span className="font-display text-lg font-medium text-text">
                      {product.name}
                    </span>
                  </span>

                  {isActive ? (
                    <span className="mt-3 flex flex-col gap-4 pl-13">
                      <span className="block text-sm leading-relaxed text-body">
                        {product.description}
                      </span>
                      <Link
                        to={`/products/${product.slug}`}
                        className="inline-flex w-fit items-center gap-2 rounded-[50px] bg-brand px-4 py-2 text-xs font-medium text-brand-ink transition-colors hover:bg-brand-bright"
                      >
                        See the console
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default function AuthPage() {
  useSeo({
    title: 'Sign in',
    description: 'Sign in to the Difaac console.',
    path: '/sign-in',
    // robots.txt disallows crawling this, which is not the same as
    // keeping it out of the index: a disallowed URL linked from
    // elsewhere can still be listed, described only by that link's
    // anchor text. This is the tag that actually excludes it.
    noindex: true,
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  // `ProtectedRoute` sends visitors here with the page they were trying to
  // reach in `state.from`, so signing in returns them there instead of
  // always dropping them on the overview.
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/workspace'

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // The access token is kept in memory by the auth client and the refresh
      // token arrives as an HttpOnly cookie, so nothing sensitive is written to
      // localStorage where page scripts could read it.
      await signIn(email, password)
      setSignedIn(true)
      setTimeout(() => navigate(redirectTo, { replace: true }), 700)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication service unavailable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink lg:grid lg:grid-cols-[1.25fr_1fr]">
{/* Ordered so the form comes first in the DOM: someone arriving to sign in should reach the fields immediately on a phone and with a keyboard, without tabbing through six product links first. */}
      <div className="order-2 hidden lg:order-1 lg:block">
        <ProductShowcasePanel />
      </div>

      <div className="order-1 flex min-h-screen flex-col justify-center px-6 py-12 sm:px-10 lg:order-2 lg:px-14">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <LogoMark />
          </div>

          <h2 className="font-display t-h2 font-medium text-text">Sign in</h2>
          <p className="mt-3 text-sm leading-relaxed text-body">
            Use the account your organisation was issued. Access is scoped to your role.
          </p>

          <form onSubmit={handleSignIn} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-2">
                Corporate email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@organisation.com"
                  className="h-12 pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-muted-2">
                  Password
                </label>
                <Link to="/forgot-password" className="tap-target text-xs font-medium text-brand hover:text-brand-bright">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-12 pl-10"
                />
              </div>
            </div>

            {error ? (
              <p role="alert" className="rounded-[4px] border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={loading || signedIn}
              className="mt-2 h-12 w-full rounded-[50px] bg-brand font-medium text-brand-ink hover:bg-brand-bright disabled:opacity-60"
            >
              {signedIn ? 'Signed in — opening workspace…' : loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-10 border-t border-line-soft pt-6 text-center">
            <p className="text-xs leading-relaxed text-muted-2">
              Difaac Group · Awdal, Somaliland ·{' '}
              <a href="mailto:Difaacgroup@gmail.com" className="text-brand hover:text-brand-bright">
                Difaacgroup@gmail.com
              </a>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-2">
              Intelligent cyber defence for the organisations that hold the line.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
