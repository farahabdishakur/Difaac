/**
 * Demo request form.
 *
 * group-ib.com closes every product page with one of these rather than a
 * link out to a contact page — the reader who is convinced at the bottom of
 * a long page should not have to navigate again to act.
 *
 * Submissions are stored by the API and read back in the SOC workspace
 * under "Demo requests". No email is sent — there is no mail service
 * configured — so the workspace queue is the delivery mechanism, and the
 * confirmation text says so rather than implying an inbox somewhere.
 */

import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { GlassIcon } from '@/components/product/product-sections'
import { submitDemoRequest } from '@/lib/demo-requests'
import type { Tone } from '@/lib/tone'
import { toneGlow } from '@/lib/tone'

const ROLES = [
  'CISO / VP Security',
  'Head of Security Operations',
  'Head of Fraud',
  'Security Analyst',
  'IT / Infrastructure',
  'Other',
] as const

export function ProductDemoForm({
  productName,
  productSlug,
  tone,
}: {
  productName: string
  productSlug: string
  tone: Tone
}) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Native constraint validation has already passed by this point.
    const data = new FormData(event.currentTarget)
    const context = String(data.get('context') ?? '').trim()

    setNotice(null)
    setSubmitting(true)
    try {
      await submitDemoRequest({
        product_slug: productSlug,
        name: String(data.get('name') ?? '').trim(),
        company: String(data.get('company') ?? '').trim(),
        email: String(data.get('email') ?? '').trim(),
        role: String(data.get('role') ?? ''),
        context: context || undefined,
      })
      setSubmitted(true)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Your request could not be submitted.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div
        className={`pointer-events-none absolute -left-32 top-1/4 size-96 rounded-full opacity-20 blur-3xl ${toneGlow[tone]}`}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-balance font-display t-h2 font-semibold text-text">
              Request your demo of {productName}
            </h2>
            <p className="max-w-lg leading-relaxed text-body">
              A Difaac specialist will walk through {productName} against your environment, not a
              generic script, and answer the questions your team actually has.
            </p>

            <ul className="flex flex-col gap-4 border-t border-line-soft pt-6">
              {[
                'A working session, not a slide deck',
                'Scoped to your sector and threat profile',
                'Integration questions answered by an engineer',
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-body">
                  <GlassIcon icon={CheckCircle2} tone={tone} size="sm" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-line-soft bg-ink-2/60 p-7 backdrop-blur-sm lg:p-9"
          >
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <GlassIcon icon={CheckCircle2} tone={tone} size="lg" />
                <h3 className="font-display text-xl font-semibold text-text">Request received</h3>
                <p className="max-w-sm text-sm leading-relaxed text-body">
                  Your request is in the queue and a Difaac specialist will be in touch to schedule
                  the session.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="demo-name" label="Full name">
                    <Input id="demo-name" name="name" required autoComplete="name" className="bg-ink-3 border-line" />
                  </Field>
                  <Field id="demo-company" label="Company">
                    <Input id="demo-company" name="company" required autoComplete="organization" className="bg-ink-3 border-line" />
                  </Field>
                </div>

                <Field id="demo-email" label="Work email">
                  <Input
                    id="demo-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@organisation.com"
                    className="bg-ink-3 border-line"
                  />
                </Field>

                <Field id="demo-role" label="Your role">
                  <select
                    id="demo-role"
                    name="role"
                    required
                    defaultValue=""
                    className="h-10 w-full rounded-[4px] border border-line bg-ink-3 px-3 text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="demo-context" label="What are you trying to solve?" optional>
                  <Textarea
                    id="demo-context"
                    name="context"
                    rows={3}
                    maxLength={1000}
                    className="bg-ink-3 border-line"
                  />
                </Field>

                {notice ? (
                  <p className="rounded-[4px] border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                    {notice}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="mt-1 w-full justify-center"
                >
                  {submitting ? 'Submitting…' : 'Request demo'}
                  {!submitting ? (
                    <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
                  ) : null}
                </Button>

                <p className="text-xs leading-relaxed text-muted-2">
                  We use these details only to arrange the demo. See our{' '}
                  <a href="/privacy" className="text-brand hover:underline">
                    privacy policy
                  </a>
                  .
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  optional,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-text">
        {label}
        {optional ? <span className="ml-1.5 font-normal normal-case text-muted-2">(optional)</span> : null}
      </label>
      {children}
    </div>
  )
}
