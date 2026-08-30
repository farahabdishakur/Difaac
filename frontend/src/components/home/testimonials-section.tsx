import { SectionHeading } from '@/components/shared/section-heading'
import { TestimonialCard } from '@/components/cards/testimonial-card'
import { testimonials } from '@/lib/data/testimonials'

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Customer stories" title="Security leaders rely on Difaac every day" />

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
