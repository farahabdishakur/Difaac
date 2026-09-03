import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, CheckCircle2, Check, Clock, Zap } from 'lucide-react'
import { somaliRegions, jobTitles } from '@/lib/data/nav'
import { products } from '@/lib/data/products'
import { getIcon } from '@/components/icons/icon-map'
import { ProductEmblem, HeroBackdrop } from '@/components/product/product-emblem'
import { productAccent } from '@/lib/tone'
import { submitDemoRequest } from '@/lib/demo-requests'


const SERVICE_GROUPS = [
  'Security Assessments',
  'Incident Response',
  'Investigations',
  'Training',
] as const

/**
 * A single selectable row: icon (optional), label, checkbox on the right.
 *
 * The minimum height is set here rather than left to the content because the
 * product rows carry an emblem and the service rows do not. Without it the
 * two grids sit directly above one another at visibly different row heights,
 * which reads as a mistake rather than as two kinds of choice.
 */
function SelectRow({
  label,
  icon,
  checked,
  onToggle,
}: {
  label: string
  icon?: React.ReactNode
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      className={`flex min-h-[4.5rem] w-full items-center justify-between gap-4 rounded-lg border px-5 py-4 text-left transition-colors ${
        checked ? 'border-brand/60 bg-brand/[0.06]' : 'border-line-soft bg-ink-2/60 hover:border-line'
      }`}
    >
      <span className="flex items-center gap-3">
        {icon}
        {/* Sized so the longest product name ("Attack Surface Management")
            still sits on one line in a half-width cell — a single wrapped
            label would make its row taller than every other row. */}
        <span className="font-display text-sm font-semibold leading-snug text-text">{label}</span>
      </span>
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
          checked ? 'border-brand bg-brand text-brand-ink' : 'border-line-soft text-transparent'
        }`}
        aria-hidden="true"
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    </button>
  )
}

/**
 * "Talk to Sales" — deliberately its own page rather than a variant of the
 * general contact form below. group-ib.com's version has no sidebar
 * competing for attention: pick the products and services you want to
 * discuss from grids, then one two-column form. That structure is followed
 * here — down to the field grid and the consent checkboxes — with Difaac's
 * own colours, product artwork, and privacy policy.
 */
function SalesPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeUpdates, setAgreeUpdates] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    jobTitle: jobTitles[0],
    phone: '',
    workEmail: '',
    country: somaliRegions[0],
    message: '',
  })

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const interests = [...selectedProducts, ...selectedServices.map((s) => `service:${s}`)]
      await submitDemoRequest({
        // Plain text, not a foreign key, so a mixed list of product slugs
        // and service labels is a legitimate value here — see the same
        // choice explained in `demo_requests.py`.
        product_slug: interests.length > 0 ? interests.join(',') : 'general-inquiry',
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        company: formData.company,
        email: formData.workEmail,
        role: formData.jobTitle,
        context: [
          formData.phone && `Phone: ${formData.phone}`,
          formData.country,
          agreeUpdates && 'Opted in to updates',
          formData.message,
        ]
          .filter(Boolean)
          .join(' — ') || undefined,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your request could not be submitted.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass =
    'h-14 rounded-2xl border border-line-soft bg-ink-2/60 px-5 text-base backdrop-blur-sm placeholder:text-muted-2'

  return (
    <>
      <section className="hero-ground -mt-14 pt-14 lg:-mt-16 lg:pt-16 relative overflow-hidden pb-16 lg:pb-20">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-4 pt-20 pb-12 text-center sm:px-6 lg:px-8 lg:pt-28">
          <h1 className="font-display t-display font-semibold leading-[1.15] text-text">
            Let&apos;s Talk
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-body">
            Any question about our products and services, or pricing? Want to schedule a demo?{' '}
            <span className="text-text">Just fill out the form</span>, and a Difaac specialist will
            contact you soon.
          </p>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-line-soft bg-ink-2/60 py-16 text-center backdrop-blur-sm">
              <CheckCircle2 className="size-16 text-brand" />
              <h3 className="font-display text-2xl font-bold text-text">Request received</h3>
              <p className="max-w-md text-sm leading-relaxed text-body">
                Your request is in the queue and a Difaac specialist will be in touch soon.
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-4">
                Send another request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
                <h2 className="font-display text-lg font-semibold text-text">Please select a product</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {products.map((product) => {
                    const Icon = getIcon(product.icon)
                    const tone = productAccent[product.slug] ?? 'brand'
                    return (
                      <SelectRow
                        key={product.slug}
                        label={product.name}
                        icon={
                          <ProductEmblem
                            icon={Icon}
                            tone={tone}
                            slug={product.slug}
                            size="menu"
                            className="-my-1"
                          />
                        }
                        checked={selectedProducts.includes(product.slug)}
                        onToggle={() => toggle(selectedProducts, setSelectedProducts, product.slug)}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
                <h2 className="font-display text-lg font-semibold text-text">or a service</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SERVICE_GROUPS.map((group) => (
                    <SelectRow
                      key={group}
                      label={group}
                      checked={selectedServices.includes(group)}
                      onToggle={() => toggle(selectedServices, setSelectedServices, group)}
                    />
                  ))}
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
                <h2 className="font-display text-lg font-semibold text-text">Fill out the form below</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="sr-only" htmlFor="sales-firstName">First name</label>
                    <Input
                      id="sales-firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="First name*"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="sales-lastName">Last name</label>
                    <Input
                      id="sales-lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Last name*"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="sales-company">Company</label>
                    <Input
                      id="sales-company"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company*"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="sales-jobTitle">Job title</label>
                    <select
                      id="sales-jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className={`${fieldClass} w-full text-text outline-none focus:border-brand`}
                    >
                      {jobTitles.map((jt) => (
                        <option key={jt} value={jt} className="bg-ink-2 text-text">
                          {jt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="sales-phone">Phone number</label>
                    <Input
                      id="sales-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone number*"
                      required
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="sales-email">Work email</label>
                    <Input
                      id="sales-email"
                      type="email"
                      required
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      placeholder="Work email*"
                      className={fieldClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="sr-only" htmlFor="sales-country">Region</label>
                    <select
                      id="sales-country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className={`${fieldClass} w-full text-text outline-none focus:border-brand`}
                    >
                      {somaliRegions.map((c) => (
                        <option key={c} value={c} className="bg-ink-2 text-text">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="sr-only" htmlFor="sales-message">Message</label>
                    <Textarea
                      id="sales-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your organization's security goals..."
                      className="rounded-2xl border border-line-soft bg-ink-2/60 px-5 py-4 text-base backdrop-blur-sm placeholder:text-muted-2"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-2">
                    <input
                      type="checkbox"
                      required
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 rounded-[3px] border border-line-soft bg-ink-3 accent-brand"
                    />
                    <span>
                      I understand and agree that my personal data will be collected and processed
                      according to the{' '}
                      <a href="/privacy" className="text-brand hover:underline">
                        Privacy Policy
                      </a>
                      . *
                    </span>
                  </label>

                  <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-2">
                    <input
                      type="checkbox"
                      checked={agreeUpdates}
                      onChange={(e) => setAgreeUpdates(e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 rounded-[3px] border border-line-soft bg-ink-3 accent-brand"
                    />
                    <span>
                      Please keep me updated about emerging threats, new adversary techniques, and
                      key customer stories. I understand that I can unsubscribe at any point by
                      clicking the relevant link in any email from Difaac.
                    </span>
                  </label>
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
                {error ? (
                  <p className="rounded-[4px] border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                    {error}
                  </p>
                ) : null}

                <Button type="submit" size="lg" disabled={submitting} className="ml-auto px-10">
                  {submitting ? 'Submitting…' : 'Submit'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

/** General "Contact Us" page — redesigned to match the company page hero style. */
function GeneralContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    company: '',
    jobTitle: jobTitles[0],
    country: somaliRegions[0],
    message: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await submitDemoRequest({
        product_slug: 'general-inquiry',
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        company: formData.company,
        email: formData.workEmail,
        role: formData.jobTitle,
        context: [formData.country, formData.message].filter(Boolean).join(' — ') || undefined,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your request could not be submitted.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero — mirrors the company page hero layout */}
      <section className="hero-ground relative -mt-14 overflow-hidden pt-[calc(3.5rem+4rem)] pb-20 lg:-mt-16 lg:pt-[calc(4rem+6rem)] lg:pb-28">
        <HeroBackdrop tone="brand" bgImage="/company-hero-3d.jpg" spread />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <h1 className="text-balance font-display text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-[1.1] text-text">
                Connect with <span className="text-gradient">Difaac</span>
              </h1>

              <p className="text-pretty text-base sm:text-lg leading-relaxed text-body max-w-xl">
                Get in touch with the team — questions about the platform, partnership interest, or anything else. We&apos;re here to help.
              </p>

              {/* Contact Info Metrics with clean icons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-line-soft">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-brand">
                    <Clock className="size-4 shrink-0" strokeWidth={2} />
                    <span className="font-display text-2xl font-black">24/7</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-2 font-medium">Availability</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-brand">
                    <Zap className="size-4 shrink-0" strokeWidth={2} />
                    <span className="font-display text-2xl font-black">&lt;2 hrs</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-2 font-medium">Response Time</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-brand">
                    <MapPin className="size-4 shrink-0" strokeWidth={2} />
                    <span className="font-display text-2xl font-black">Awdal</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-2 font-medium">Headquarters</div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Info Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl border border-brand/30 bg-ink-2/80 p-6 sm:p-8 shadow-[0_0_80px_rgba(0,201,121,0.2)] backdrop-blur-md">
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand border border-brand/20 shadow-sm">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text text-sm">Office</h4>
                      <p className="text-xs text-body leading-relaxed">Awdal, Somaliland</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand border border-brand/20 shadow-sm">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text text-sm">Email</h4>
                      <a href="mailto:Difaacgroup@gmail.com" className="text-xs text-brand hover:underline">
                        Difaacgroup@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand border border-brand/20 shadow-sm">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text text-sm">Phone</h4>
                      <a href="tel:+252672489335" className="text-xs text-brand hover:underline">
                        +252 672489335
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand border border-brand/20 shadow-sm">
                      <Clock className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text text-sm">Business Hours</h4>
                      <p className="text-xs text-body leading-relaxed">Saturday – Thursday, 8:00 AM – 6:00 PM (EAT)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24 bg-ink-2">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flat-card p-8 sm:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <CheckCircle2 className="size-16 text-brand" />
                <h3 className="font-display text-2xl font-bold text-text">Message Received</h3>
                <p className="max-w-md text-sm text-body leading-relaxed">
                  Thank you for reaching out to Difaac. Your request is in the queue and a
                  specialist will review it shortly.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-4">
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="font-display text-xl font-bold text-text mb-1">Send us a message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="text-xs font-semibold text-text uppercase tracking-wider">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Elena"
                      className="bg-ink-3 border-line"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="text-xs font-semibold text-text uppercase tracking-wider">
                      Last Name *
                    </label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Marsh"
                      className="bg-ink-3 border-line"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="workEmail" className="text-xs font-semibold text-text uppercase tracking-wider">
                      Work Email *
                    </label>
                    <Input
                      id="workEmail"
                      type="email"
                      required
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      placeholder="elena@company.com"
                      className="bg-ink-3 border-line"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="company" className="text-xs font-semibold text-text uppercase tracking-wider">
                      Company Name *
                    </label>
                    <Input
                      id="company"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Corp"
                      className="bg-ink-3 border-line"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="jobTitle" className="text-xs font-semibold text-text uppercase tracking-wider">
                      Job Title
                    </label>
                    <select
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="h-10 rounded-none border border-line bg-ink-3 px-3 text-sm text-text focus:outline-none focus:border-brand"
                    >
                      {jobTitles.map((jt) => (
                        <option key={jt} value={jt} className="bg-ink-2 text-text">
                          {jt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="country" className="text-xs font-semibold text-text uppercase tracking-wider">
                      Region
                    </label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="h-10 rounded-none border border-line bg-ink-3 px-3 text-sm text-text focus:outline-none focus:border-brand"
                    >
                      {somaliRegions.map((c) => (
                        <option key={c} value={c} className="bg-ink-2 text-text">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-semibold text-text uppercase tracking-wider">
                    How can we help?
                  </label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your organization's security goals or current exposure..."
                    className="bg-ink-3 border-line"
                  />
                </div>

                {error ? (
                  <p className="rounded-[4px] border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full justify-center bg-brand text-brand-ink hover:bg-brand-bright font-semibold"
                >
                  {submitting ? 'Submitting…' : 'Submit Request'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default function ContactPage({ isSales = false }: { isSales?: boolean }) {
  return isSales ? <SalesPage /> : <GeneralContactPage />
}
