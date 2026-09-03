import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Lock,
  FileText,
  Mail,
  Clock,
  CheckCircle2,
  Globe,
  Server,
} from 'lucide-react'

interface LegalPageProps {
  type: 'privacy' | 'terms'
}

export default function LegalPage({ type }: LegalPageProps) {
  const isPrivacy = type === 'privacy'
  const [activeSection, setActiveSection] = useState<string>('')

  const privacySections = [
    { id: 'introduction', title: '1. Introduction & Overview' },
    { id: 'scope', title: '2. Scope & Applicable Services' },
    { id: 'information-collected', title: '3. Information We Collect' },
    { id: 'telemetry-threat-data', title: '4. Security Telemetry & Threat Data' },
    { id: 'purpose-of-processing', title: '5. How We Use Information' },
    { id: 'data-protection-security', title: '6. Data Security & Storage Standards' },
    { id: 'data-sharing-disclosure', title: '7. Information Sharing & Third Parties' },
    { id: 'international-transfers', title: '8. International Data Transfers' },
    { id: 'data-retention', title: '9. Data Retention & Deletion' },
    { id: 'your-rights', title: '10. Your Rights & Privacy Choices' },
    { id: 'contact', title: '11. Data Protection Officer & Contact' },
  ]

  const termsSections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'platform-services', title: '2. Difaac Platform & Services' },
    { id: 'authorized-use', title: '3. Authorized Use & Account Security' },
    { id: 'intellectual-property', title: '4. Intellectual Property & Threat Data' },
    { id: 'customer-telemetry', title: '5. Customer Telemetry & Confidentiality' },
    { id: 'prohibited-activities', title: '6. Prohibited Activities & Restrictions' },
    { id: 'sla-service-levels', title: '7. Service Level Agreements & SLAs' },
    { id: 'warranties-disclaimers', title: '8. Disclaimers & Threat Advisory Scope' },
    { id: 'limitation-of-liability', title: '9. Limitation of Liability' },
    { id: 'term-termination', title: '10. Term & Suspension of Services' },
    { id: 'governing-law', title: '11. Governing Law & Dispute Resolution' },
    { id: 'legal-contact', title: '12. Legal Inquiries & Notices' },
  ]

  const sections = isPrivacy ? privacySections : termsSections

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  return (
    <div className="relative min-h-screen bg-ink text-text">
      {/* Header Banner */}
      <section className="relative bg-ink bg-glow-pattern pt-16 pb-16 lg:pt-24 lg:pb-20">
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-2 uppercase tracking-wider">
            <Link to="/" className="hover:text-brand transition-colors">Home</Link>
            <span>/</span>
            <span className="text-muted-2">Legal Governance</span>
            <span>/</span>
            <span className="text-brand">{isPrivacy ? 'Privacy Policy' : 'Terms of Use'}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand mb-4">
                <ShieldCheck className="size-3.5" />
                <span>Difaac Enterprise Legal Framework</span>
              </div>
              <h1 className="font-display t-h1 font-bold text-text">
                {isPrivacy ? 'Privacy Policy' : 'Terms of Use'}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-body leading-relaxed max-w-2xl">
                {isPrivacy
                  ? 'Learn how Difaac Intelligent Cyber Defence Platform collects, processes, and protects organizational security telemetry, customer records, and global threat intelligence in strict compliance with international privacy laws.'
                  : 'The legally binding terms governing the deployment, licensing, and operational use of Difaac security software, threat intelligence feeds, managed detection services, and cyber defense portals.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-line bg-ink-2 p-5 text-xs text-muted-2 shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-brand" />
                <span>Effective Date: <strong className="text-text">January 1, 2026</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-brand" />
                <span>Jurisdiction: <strong className="text-text">Global Enterprise Framework</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand" />
                <span>Compliance: <strong className="text-text">ISO/IEC 27001, SOC 2, GDPR</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Legal Content with Sticky Sidebar */}
      <section className="py-16 lg:py-24 bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
            {/* Sticky Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-xl border border-line bg-ink p-6 shadow-lg">
                <h2 className="text-xs font-bold uppercase tracking-wider text-text mb-4 flex items-center gap-2">
                  <FileText className="size-4 text-brand" />
                  Table of Contents
                </h2>
                <nav className="flex flex-col gap-1.5 text-xs">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className={`rounded-md px-3 py-2 transition-all leading-snug ${
                        activeSection === sec.id
                          ? 'bg-brand/10 text-brand font-semibold border-l-2 border-brand'
                          : 'text-body hover:bg-ink-3 hover:text-text'
                      }`}
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-line-soft">
                  <p className="text-[11px] text-muted-2 leading-relaxed mb-3">
                    Need official legal documentation or a custom Data Processing Agreement (DPA)?
                  </p>
                  <a
                    href={`mailto:${isPrivacy ? 'privacy@difaac.com' : 'legal@difaac.com'}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                  >
                    <Mail className="size-3.5" />
                    Contact Legal Team
                  </a>
                </div>
              </div>
            </aside>

            {/* Legal Body Text */}
            <article className="prose prose-invert max-w-none space-y-12 text-body leading-relaxed text-sm sm:text-base">
              {isPrivacy ? (
                <>
                  {/* PRIVACY POLICY CONTENT */}
                  <div id="introduction" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">1.</span> Introduction & Overview
                    </h2>
                    <p className="mb-4">
                      Difaac ("Difaac", "we", "us", or "our") is a specialized provider of an <strong>Intelligent Cyber Defence Platform</strong>, delivering real-time Threat Intelligence, Managed Extended Detection and Response (Managed XDR), Fraud Protection, Digital Risk Protection, Attack Surface Management, and incident containment solutions to global enterprises, government institutions, and critical infrastructure operators.
                    </p>
                    <p className="mb-4">
                      This Privacy Policy governs our collection, processing, protection, and retention of personal data and security telemetry when you interact with our websites, portals, threat intelligence graphs, SaaS services, API interfaces, and advisory engagements.
                    </p>
                    <p>
                      We strictly adhere to core data privacy principles, including data minimization, purposeful processing, transparency, and top-tier cryptographic security across all operational environments.
                    </p>
                  </div>

                  <div id="scope" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">2.</span> Scope & Applicable Services
                    </h2>
                    <p className="mb-4">
                      This Policy applies to all individuals and entities who:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2 text-body mb-4">
                      <li>Visit or interact with the public Difaac web applications (difaac.io and related domains).</li>
                      <li>Access or subscribe to Difaac security software, portal dashboards, or threat intelligence feeds.</li>
                      <li>Communicate with our technical, sales, incident response, or customer support teams.</li>
                      <li>Are identified within cybersecurity defense telemetry as part of authorized threat detection, malware analysis, or fraud prevention operations.</li>
                    </ul>
                    <p className="text-xs text-muted-2 bg-ink-2 p-4 rounded-lg border border-line-soft">
                      <strong>Note on Customer Data:</strong> When we process telemetry or endpoint logs on behalf of our enterprise customers as a Data Processor, the terms of the customer's dedicated Data Processing Addendum (DPA) govern that processing.
                    </p>
                  </div>

                  <div id="information-collected" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">3.</span> Information We Collect
                    </h2>
                    <p className="mb-4">
                      We collect and categorize information strictly as required to maintain our defense platform:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-ink-2 border border-line-soft">
                        <h3 className="font-display text-base font-semibold text-text mb-1">A. Account & Business Contact Information</h3>
                        <p className="text-sm text-body">
                          Full name, corporate email address, professional job title, company name, phone number, and billing details provided during account registration, consultation requests, or subscription renewals.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-ink-2 border border-line-soft">
                        <h3 className="font-display text-base font-semibold text-text mb-1">B. Authentication & Portal Activity Records</h3>
                        <p className="text-sm text-body">
                          Login timestamps, IP addresses used for authentication, multi-factor authentication metadata, API key usage metrics, and audit log events within the Difaac management portal.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-ink-2 border border-line-soft">
                        <h3 className="font-display text-base font-semibold text-text mb-1">C. Technical Usage & Diagnostic Data</h3>
                        <p className="text-sm text-body">
                          Browser type, operating system version, referring URLs, performance metrics, and session diagnostic traces captured solely to ensure platform reliability and detect unauthorized portal access.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div id="telemetry-threat-data" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">4.</span> Security Telemetry & Threat Data Processing
                    </h2>
                    <p className="mb-4">
                      In our capacity as an <strong>Intelligent Cyber Defence Platform</strong>, Difaac ingests, correlates, and analyzes security telemetry for threat detection and adversary neutralization. This data includes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2 text-body mb-4">
                      <li><strong>Adversary Indicators (IOCs):</strong> Malicious IP addresses, malicious domain registrations, file hashes, command-and-control (C2) server signatures, and malware binaries.</li>
                      <li><strong>Endpoint & Network Telemetry:</strong> Anonymized process execution events, DNS lookup metadata, and network flow traces ingested via Difaac sensors.</li>
                      <li><strong>Dark Web & Cybercrime Intelligence:</strong> Intelligence scraped from public, deep, and dark web illicit forums relating to stolen corporate credentials, leaked source code, and imminent threat campaigns.</li>
                      <li><strong>Fraud Biometric Signals:</strong> Frictionless client-side behavioral biometrics (e.g. mouse dynamics, typing cadence) used solely to differentiate automated attack bots from legitimate human users.</li>
                    </ul>
                    <div className="p-4 rounded-lg bg-brand/5 border border-brand/20 text-xs text-brand">
                      <strong>Privacy Safeguard:</strong> Difaac never builds consumer profiling databases or sells telemetry to commercial advertisers. All threat data processing is conducted strictly under the legal basis of cybersecurity and legitimate defense interests (GDPR Recital 49).
                    </div>
                  </div>

                  <div id="purpose-of-processing" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">5.</span> How We Use Information
                    </h2>
                    <p className="mb-4">We process information solely for the following legitimate purposes:</p>
                    <ul className="list-disc list-inside space-y-2 pl-2 text-body mb-4">
                      <li><strong>Threat Detection & Response:</strong> Correlating endpoint, network, and cloud telemetry to identify and disrupt active cyber attacks in progress.</li>
                      <li><strong>Adversary Attribution:</strong> Profiling threat actor groups, their tactics, techniques, and procedures (TTPs) mapped to MITRE ATT&CK.</li>
                      <li><strong>Service Delivery & Portal Operation:</strong> Provisioning user accounts, authenticating sessions, delivering intelligence feeds, and executing automated containment playbooks.</li>
                      <li><strong>Platform Security & Integrity:</strong> Monitoring our own infrastructure against distributed denial-of-service (DDoS) attempts, brute-force intrusions, and API abuse.</li>
                      <li><strong>Legal & Compliance Obligations:</strong> Satisfying mandatory audit requirements, verifying export control compliance, and cooperating with authorized cybercrime investigations.</li>
                    </ul>
                  </div>

                  <div id="data-protection-security" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">6.</span> Data Security & Storage Standards
                    </h2>
                    <p className="mb-4">
                      Security is at the core of everything we build. Difaac implements enterprise-grade technical, operational, and organizational security controls:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                      <div className="p-4 rounded-lg bg-ink-2 border border-line-soft">
                        <div className="flex items-center gap-2 text-brand font-bold text-sm mb-1">
                          <Lock className="size-4" /> Military-Grade Encryption
                        </div>
                        <p className="text-xs text-body">
                          All data is encrypted in transit using TLS 1.3 with forward secrecy, and encrypted at rest using AES-256 with hardware security module (HSM) key management.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-ink-2 border border-line-soft">
                        <div className="flex items-center gap-2 text-brand font-bold text-sm mb-1">
                          <Server className="size-4" /> Certified Infrastructure
                        </div>
                        <p className="text-xs text-body">
                          Our cloud infrastructure is hosted in tier-4 data centers adhering strictly to ISO/IEC 27001, SOC 2 Type II, and PCI-DSS Level 1 compliance certifications.
                        </p>
                      </div>
                    </div>
                    <p>
                      Access to client telemetry is strictly constrained via Role-Based Access Control (RBAC), multi-factor authentication, and audited zero-trust access tunnels.
                    </p>
                  </div>

                  <div id="data-sharing-disclosure" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">7.</span> Information Sharing & Third Parties
                    </h2>
                    <p className="mb-4">
                      Difaac maintains a strict non-disclosure posture. We do not sell, rent, or monetize personal data or security telemetry. We only share information under the following limited circumstances:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2 text-body mb-4">
                      <li><strong>Vetted Sub-processors:</strong> Trusted cloud hosting and communication vendors bound by strict data protection agreements and security audits.</li>
                      <li><strong>Law Enforcement Referrals:</strong> When collaborating with certified international law enforcement bodies (e.g. INTERPOL, Europol) to prosecute threat actors, strictly subject to legitimate judicial subpoenas or warrants.</li>
                      <li><strong>Corporate Transactions:</strong> In connection with a merger, acquisition, or restructuring, where the receiving entity agrees to uphold the protections defined in this Policy.</li>
                    </ul>
                  </div>

                  <div id="international-transfers" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">8.</span> International Data Transfers
                    </h2>
                    <p className="mb-4">
                      Difaac serves clients globally. When personal data is transferred across international borders, we ensure that adequate safeguards are enforced in accordance with applicable laws, including the execution of standard contractual clauses (SCCs) and regional data residency storage options.
                    </p>
                  </div>

                  <div id="data-retention" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">9.</span> Data Retention & Deletion
                    </h2>
                    <p className="mb-4">
                      We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, maintain active subscriptions, or satisfy statutory audit requirements. Security telemetry is retained in accordance with customer contractual agreements, after which it is securely purged or irreversibly anonymized.
                    </p>
                  </div>

                  <div id="your-rights" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">10.</span> Your Rights & Privacy Choices
                    </h2>
                    <p className="mb-4">
                      Depending on your geographical jurisdiction (e.g. European Economic Area, UK, California), you have specific statutory rights concerning your personal data:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2 text-body mb-4">
                      <li><strong>Right of Access:</strong> You may request a copy of the personal data we hold about you.</li>
                      <li><strong>Right to Rectification:</strong> You may request corrections to any inaccurate or incomplete records.</li>
                      <li><strong>Right to Erasure:</strong> You may request the deletion of your personal records where no overriding legal obligation exists.</li>
                      <li><strong>Right to Restriction & Objection:</strong> You may object to or restrict specific processing operations.</li>
                      <li><strong>Right to Data Portability:</strong> You may request your data in a structured, commonly used, machine-readable format.</li>
                    </ul>
                    <p>
                      To exercise any of these rights, contact our Data Protection Office at{' '}
                      <a href="mailto:privacy@difaac.com" className="text-brand font-medium hover:underline">
                        privacy@difaac.com
                      </a>. We will respond within 30 days.
                    </p>
                  </div>

                  <div id="contact" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">11.</span> Data Protection Officer & Contact Information
                    </h2>
                    <p className="mb-4">
                      For any questions, concerns, or regulatory requests concerning this Privacy Policy or Difaac's data protection practices, please contact:
                    </p>
                    <div className="p-5 rounded-xl border border-line bg-ink-2/60 text-sm">
                      <p className="font-bold text-text">Difaac Cyber Defence — Data Protection Office</p>
                      <p className="text-body mt-1">Global Security & Compliance Department</p>
                      <p className="text-body mt-1">Email: <a href="mailto:privacy@difaac.com" className="text-brand hover:underline font-medium">privacy@difaac.com</a></p>
                      <p className="text-body mt-1">General Legal: <a href="mailto:legal@difaac.com" className="text-brand hover:underline font-medium">legal@difaac.com</a></p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* TERMS OF USE CONTENT */}
                  <div id="acceptance" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">1.</span> Acceptance of Terms
                    </h2>
                    <p className="mb-4">
                      These Terms of Use ("Terms") constitute a legally binding agreement between you or the entity you represent ("Customer", "you", or "user") and Difaac ("Difaac", "we", "us", or "our").
                    </p>
                    <p className="mb-4">
                      By accessing, browsing, testing, or subscribing to the <strong>Difaac Intelligent Cyber Defence Platform</strong>, software agents, threat intelligence portals, APIs, or Managed XDR services, you explicitly agree to be bound by these Terms and our Privacy Policy.
                    </p>
                    <p className="text-xs text-muted-2 bg-ink-2 p-4 rounded-lg border border-line-soft">
                      If you are entering into these Terms on behalf of a company, organization, or government agency, you represent that you possess the full legal authority to bind that entity to these Terms.
                    </p>
                  </div>

                  <div id="platform-services" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">2.</span> Difaac Platform & Services
                    </h2>
                    <p className="mb-4">
                      Difaac provides an advanced ecosystem of enterprise cybersecurity software and services, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2 text-body mb-4">
                      <li><strong>Managed Extended Detection and Response (Managed XDR):</strong> 24/7 endpoint, cloud, and network telemetry monitoring, threat hunting, and guided incident containment.</li>
                      <li><strong>Threat Intelligence (CTI):</strong> Adversary actor profiling, campaign tracking, zero-day threat feeds, and dark web monitoring.</li>
                      <li><strong>Fraud Protection & Identity Defense:</strong> Client-side behavioral biometrics, device fingerprinting, and real-time transaction risk scoring.</li>
                      <li><strong>Digital Risk Protection & ASM:</strong> External attack surface scanning, shadow IT discovery, and automated domain takedowns.</li>
                      <li><strong>Cyber Defence Advisory:</strong> Incident response retainers, compromise assessments, red teaming, and digital forensics.</li>
                    </ul>
                  </div>

                  <div id="authorized-use" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">3.</span> Authorized Use & Account Security
                    </h2>
                    <p className="mb-4">
                      You are granted a non-exclusive, non-transferable, revocable license to access the Difaac platform solely for internal cybersecurity and risk mitigation purposes.
                    </p>
                    <p className="mb-4">
                      You are responsible for maintaining the confidentiality of portal login credentials and API keys. Any action performed under your credentials will be deemed authorized by your organization. You must immediately notify Difaac of any suspected compromise of access credentials.
                    </p>
                  </div>

                  <div id="intellectual-property" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">4.</span> Intellectual Property & Threat Data
                    </h2>
                    <p className="mb-4">
                      All intellectual property rights, trademarks, patents, software architectures, threat graphs, algorithm models, YARA/Sigma rule sets, and research reports generated by Difaac remain the exclusive property of Difaac.
                    </p>
                    <p>
                      Threat intelligence feeds, indicators of compromise, and research briefings supplied to you may be consumed solely for your organization's internal defense and must not be resold, syndicated, or publicly redistributed without prior written consent.
                    </p>
                  </div>

                  <div id="customer-telemetry" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">5.</span> Customer Telemetry & Confidentiality
                    </h2>
                    <p className="mb-4">
                      The Customer retains all right, title, and ownership interest in all raw logs, endpoint artifacts, and proprietary telemetry transmitted to Difaac.
                    </p>
                    <p className="mb-4">
                      Difaac treats customer telemetry as confidential information. Difaac may generate aggregated, de-identified metadata (e.g. anonymous threat actor statistics, global malware prevalence) strictly to enhance threat defense models for the collective customer network without disclosing any customer-identifiable data.
                    </p>
                  </div>

                  <div id="prohibited-activities" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">6.</span> Prohibited Activities & Restrictions
                    </h2>
                    <p className="mb-4">You agree NOT to:</p>
                    <ul className="list-disc list-inside space-y-2 pl-2 text-body mb-4">
                      <li>Decompile, disassemble, reverse engineer, or attempt to derive the source code of any Difaac software or sensor agent.</li>
                      <li>Use Difaac threat feeds or intelligence to develop competitive cybersecurity products.</li>
                      <li>Conduct unauthorized stress-testing, vulnerability assessments, or penetration tests against Difaac SaaS infrastructure without explicit written authorization.</li>
                      <li>Utilize the platform or services for any unlawful, harassing, malicious, or unauthorized surveillance purposes.</li>
                    </ul>
                  </div>

                  <div id="sla-service-levels" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">7.</span> Service Level Agreements & SLAs
                    </h2>
                    <p className="mb-4">
                      Difaac commits to maintaining 99.9% platform availability for cloud portals and API endpoints, excluding scheduled maintenance windows. For enterprise customers subscribed to Managed XDR, response times for critical threat notifications are governed by the specific SLA tier outlined in the active subscription agreement (e.g. &lt;15 minute triage SLA).
                    </p>
                  </div>

                  <div id="warranties-disclaimers" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">8.</span> Disclaimers & Threat Advisory Scope
                    </h2>
                    <p className="mb-4">
                      While Difaac deploys cutting-edge artificial intelligence, machine learning, and elite human analysts to identify and mitigate cyber threats, cybersecurity inherently involves evolving adversary tactics.
                    </p>
                    <div className="p-4 rounded-lg bg-ink-2 border border-line-soft text-xs text-body leading-relaxed mb-4">
                      <strong>Disclaimer:</strong> EXCEPT AS EXPRESSLY SET FORTH IN A FORMAL ENTERPRISE MASTER SERVICES AGREEMENT, DIFAAC SERVICES AND THREAT FEEDS ARE PROVIDED "AS IS" AND "AS AVAILABLE". DIFAAC DOES NOT WARRANT THAT THE PLATFORM WILL PREVENT ALL POSSIBLE CYBERSECURITY INCIDENTS OR ZERO-DAY EXPLOITS.
                    </div>
                  </div>

                  <div id="limitation-of-liability" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">9.</span> Limitation of Liability
                    </h2>
                    <p className="mb-4">
                      To the maximum extent permitted by applicable law, in no event shall Difaac or its directors, employees, or partners be liable for any indirect, punitive, incidental, special, or consequential damages, including loss of profits, data loss, or business interruption.
                    </p>
                    <p>
                      Difaac's aggregate cumulative liability arising out of or related to these Terms shall not exceed the total fees paid by the Customer to Difaac in the twelve (12) months preceding the claim.
                    </p>
                  </div>

                  <div id="term-termination" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">10.</span> Term & Suspension of Services
                    </h2>
                    <p className="mb-4">
                      These Terms remain in full effect during your active use or subscription. Difaac reserves the right to immediately suspend portal access or API keys if an active breach of security, unauthorized credential sharing, or unlawful usage is detected.
                    </p>
                  </div>

                  <div id="governing-law" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">11.</span> Governing Law & Dispute Resolution
                    </h2>
                    <p className="mb-4">
                      These Terms shall be governed by and construed in accordance with the laws governing international commercial enterprise contracts. Any dispute arising under these Terms shall be resolved through good-faith negotiation, and if unresolved, through binding international commercial arbitration.
                    </p>
                  </div>

                  <div id="legal-contact" className="rounded-2xl border border-line bg-ink p-8 sm:p-10 shadow-sm scroll-mt-28">
                    <h2 className="font-display text-2xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="text-brand">12.</span> Legal Inquiries & Official Notices
                    </h2>
                    <p className="mb-4">
                      For official legal notices, contractual questions, or licensing clarifications, please address correspondence to:
                    </p>
                    <div className="p-5 rounded-xl border border-line bg-ink-2/60 text-sm">
                      <p className="font-bold text-text">Difaac Legal & Corporate Governance Office</p>
                      <p className="text-body mt-1">Enterprise Licensing & Regulatory Affairs</p>
                      <p className="text-body mt-1">Email: <a href="mailto:legal@difaac.com" className="text-brand hover:underline font-medium">legal@difaac.com</a></p>
                      <p className="text-body mt-1">Privacy Office: <a href="mailto:privacy@difaac.com" className="text-brand hover:underline font-medium">privacy@difaac.com</a></p>
                    </div>
                  </div>
                </>
              )}
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
