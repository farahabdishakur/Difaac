import { useState } from 'react'
import { PageHero } from '@/components/shared/page-hero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react'
import { countries, jobTitles } from '@/lib/data/nav'

export default function ContactPage({ isSales = false }: { isSales?: boolean }) {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    company: '',
    jobTitle: jobTitles[0],
    country: countries[0],
    message: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <PageHero
        eyebrow={isSales ? 'Talk to Sales' : 'Contact Us'}
        title={isSales ? 'Get a Tailored Defense Demo' : 'Connect with Difaac Global'}
        description={
          isSales
            ? 'Schedule a detailed demonstration of the Difaac platform custom-configured for your enterprise threat model.'
            : 'Get in touch with our security specialists, support team, or emergency incident hotline.'
        }
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: isSales ? 'Talk to Sales' : 'Contact' },
        ]}
      />

      <section className="py-16 lg:py-24 bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            {/* Contact Info & Hotline */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flat-card border-brand/40 bg-brand-ink/40 p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-brand font-semibold text-sm">
                  <ShieldAlert className="size-5" />
                  <span>24/7 Emergency Incident Hotline</span>
                </div>
                <p className="text-sm text-body">
                  If you are currently experiencing an active cyber incident or ransomware attack, contact our hotline immediately.
                </p>
                <a
                  href="tel:+18005550199"
                  className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-text hover:text-brand transition-colors"
                >
                  <Phone className="size-5 text-brand" />
                  +1 (800) 555-0199
                </a>
              </div>

              <div className="flex flex-col gap-6">
                <h3 className="font-display text-xl font-bold text-text">Global Offices</h3>

                <div className="flex items-start gap-4">
                  <MapPin className="size-5 text-brand shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-text text-sm">Americas Headquarters</h4>
                    <p className="text-xs text-body leading-relaxed">
                      100 Cyber Defense Way, Suite 400<br />
                      New York, NY 10001, USA
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="size-5 text-brand shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-text text-sm">EMEA Center</h4>
                    <p className="text-xs text-body leading-relaxed">
                      Security Tower, Floor 12<br />
                      Amsterdam, Netherlands
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="size-5 text-brand shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-text text-sm">General Inquiries</h4>
                    <a href="mailto:contact@difaac.com" className="text-xs text-brand hover:underline">
                      contact@difaac.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 flat-card p-8 sm:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                  <CheckCircle2 className="size-16 text-brand" />
                  <h3 className="font-display text-2xl font-bold text-text">Message Received</h3>
                  <p className="max-w-md text-sm text-body leading-relaxed">
                    Thank you for reaching out to Difaac. A security specialist will review your request and get back to you within 2 business hours.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-4">
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h3 className="font-display text-xl font-bold text-text mb-1">
                    {isSales ? 'Request a Security Demo' : 'Send us a message'}
                  </h3>

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
                        Country
                      </label>
                      <select
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="h-10 rounded-none border border-line bg-ink-3 px-3 text-sm text-text focus:outline-none focus:border-brand"
                      >
                        {countries.map((c) => (
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

                  <Button type="submit" size="lg" className="w-full justify-center bg-brand text-brand-ink hover:bg-brand-bright font-semibold">
                    Submit Request
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
