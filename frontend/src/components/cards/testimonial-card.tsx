type Testimonial = {
  quote: string
  name: string
  title: string
  company: string
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial; index?: number }) {
  const initials = testimonial.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <figure className="flex h-full flex-col justify-between gap-6 rounded-[4px] border border-line bg-ink-2 p-7 transition-all duration-200 hover:border-brand/50">
      <blockquote className="text-pretty text-sm leading-relaxed text-body">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <figcaption className="flex items-center gap-3 border-t border-line/70 pt-5">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-[2px] border border-brand/40 bg-brand/10 text-xs font-mono font-bold text-brand"
          aria-hidden="true"
        >
          {initials}
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-semibold text-text">{testimonial.name}</span>
          <span className="text-xs text-muted-2">
            {testimonial.title}, <span className="text-text">{testimonial.company}</span>
          </span>
        </span>
      </figcaption>
    </figure>
  )
}


