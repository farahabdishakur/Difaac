import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BookOpen, Video, FileText, Download, X, ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { Button } from '@/components/ui/button'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

type ResourceItem = {
  title: string
  type: 'Report' | 'White Paper' | 'Webinar' | 'Guide' | 'Playbook'
  icon: typeof FileText
  isNew: boolean
  description: string
}

const resourcesList: ResourceItem[] = [
  {
    title: 'Global Threat Landscape Report 2026',
    type: 'Report',
    icon: FileText,
    isNew: true,
    description: 'An in-depth intelligence review of global threat actor operations, ransomware trends, and state-sponsored activity observed across 70+ countries over the past year.',
  },
  {
    title: 'Ransomware Evolution in Financial Sector',
    type: 'White Paper',
    icon: BookOpen,
    isNew: false,
    description: 'Detailed analysis of double-extortion tactics, data exfiltration patterns, and negotiation dynamics in modern banking breaches.',
  },
  {
    title: 'How to Defend Against State-Sponsored APTs',
    type: 'Webinar',
    icon: Video,
    isNew: true,
    description: 'Watch Difaac principal threat researchers demonstrate live detection and hunting techniques against sophisticated adversary groups.',
  },
  {
    title: 'Securing the CI/CD Pipeline',
    type: 'Guide',
    icon: BookOpen,
    isNew: false,
    description: 'Practical architectural controls to prevent supply-chain breaches, credential exposure, and unauthorized artifact tampering in DevOps workflows.',
  },
  {
    title: 'Incident Response Playbook 2026',
    type: 'Playbook',
    icon: Download,
    isNew: false,
    description: 'Step-by-step triage protocols, isolation steps, and escalation trees for containment within the first 60 minutes of compromise.',
  },
  {
    title: 'Dark Web Monitoring Best Practices',
    type: 'Webinar',
    icon: Video,
    isNew: false,
    description: 'Learn how automated crawling of closed cybercrime communities surfaces leaked credentials and stolen access before exploitation occurs.',
  },
]

/**
 * Maps the URL hash the navigation links to onto a filter tab.
 *
 * The Resources menu points at /resources#reports, #webinars and so on. Those
 * anchors do not exist as elements, so without this the links landed on the
 * page and did nothing. Driving the filter from the hash makes each menu entry
 * arrive on the view it names.
 */
const HASH_TO_FILTER: Record<string, string> = {
  reports: 'Report',
  webinars: 'Webinar',
  'white-papers': 'White Paper',
  documentation: 'Guide',
  glossary: 'Guide',
}

export default function ResourcesPage() {
  const { hash } = useLocation()
  const [filter, setFilter] = useState<string>(
    () => HASH_TO_FILTER[hash.replace('#', '')] ?? 'All',
  )

  // The menu can be used again while already on this page, which changes the
  // hash without remounting.
  useEffect(() => {
    setFilter(HASH_TO_FILTER[hash.replace('#', '')] ?? 'All')
  }, [hash])
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null)

  const filteredResources =
    filter === 'All'
      ? resourcesList
      : resourcesList.filter((r) => r.type.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <div className="relative overflow-hidden bg-ink">
        <PageHero
          eyebrow="Resources"
          title="Cybersecurity Knowledge Hub"
          description="Access elite threat intelligence reports, white papers, and webinars from Difaac experts."
          breadcrumb={[
            { label: 'Home', href: '/' },
            { label: 'Resources' },
          ]}
        />
      </div>

      <section className="relative py-20 lg:py-28 bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-text">Latest Intelligence</h2>
            <div className="flex flex-wrap gap-2">
              {['All', 'Report', 'Webinar', 'White Paper', 'Guide', 'Playbook'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-1.5 text-sm font-medium border transition-colors ${
                    filter === tab
                      ? 'bg-brand-ink text-brand border-brand/50'
                      : 'bg-ink-3 text-body border-line hover:text-text hover:bg-ink'
                  }`}
                >
                  {tab}s
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res, i) => {
              const Icon = res.icon
              return (
                <div
                  key={i}
                  onClick={() => setSelectedResource(res)}
                  className="flat-card flat-card-hover p-6 group flex flex-col justify-between h-[240px] cursor-pointer transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="flex size-10 items-center justify-center bg-ink-3 text-brand border border-line">
                        <Icon className="size-5" />
                      </span>
                      {res.isNew && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand text-brand-ink">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-2 uppercase tracking-wider mb-2 block">{res.type}</span>
                    <h3 className="text-lg font-bold text-text line-clamp-3">{res.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    Access Resource
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <DialogPrimitive.Root open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
            <DialogPrimitive.Popup className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="flat-card border-line max-w-lg w-full p-8 relative flex flex-col gap-5 bg-ink-2">
                <DialogPrimitive.Close
                  render={
                    <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-2 hover:text-text" />
                  }
                >
                  <X className="size-5" />
                </DialogPrimitive.Close>

                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center bg-brand/10 text-brand">
                    <selectedResource.icon className="size-5" />
                  </span>
                  <span className="text-xs font-semibold text-brand uppercase tracking-wider">{selectedResource.type}</span>
                </div>

                <DialogPrimitive.Title className="font-display text-xl font-bold text-text">
                  {selectedResource.title}
                </DialogPrimitive.Title>

                <DialogPrimitive.Description className="text-sm text-body leading-relaxed">
                  {selectedResource.description}
                </DialogPrimitive.Description>

                <div className="mt-4 flex gap-3">
                  <Button
                    className="bg-brand text-brand-ink hover:bg-brand-bright font-semibold w-full justify-center"
                    onClick={() => {
                      alert(`Thank you for requesting "${selectedResource.title}". Downloading now...`)
                      setSelectedResource(null)
                    }}
                  >
                    Download Resource
                  </Button>
                </div>
              </div>
            </DialogPrimitive.Popup>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}

      <section className="py-20 lg:py-32 bg-ink border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Subscribe to Difaac Threat Intelligence"
            description="Get the latest indicators of compromise (IoCs), malware analysis, and vulnerability reports delivered to your inbox."
          />
        </div>
      </section>
    </>
  )
}

