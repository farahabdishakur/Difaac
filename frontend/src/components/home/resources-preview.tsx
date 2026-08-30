import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { LinkButton } from '@/components/shared/link-button'
import { ResourceCard } from '@/components/cards/resource-card'
import { resources } from '@/lib/data/resources'

export function ResourcesPreview() {
  return (
    <section className="bg-ink py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Resources"
          title="Threat research and reports"
          description="Reports, analyst briefs, and research papers from our threat intelligence team."
          action={
            <LinkButton href="/resources" variant="secondary" size="sm" className="hidden sm:inline-flex">
              View all resources
              <ArrowRight className="size-3.5" data-icon="inline-end" />
            </LinkButton>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.slice(0, 3).map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  )
}


