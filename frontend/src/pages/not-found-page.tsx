import { LinkButton } from '@/components/shared/link-button'

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-2">404</span>
      <h1 className="text-balance font-display text-3xl font-medium text-text sm:text-4xl">
        We couldn&apos;t find that page
      </h1>
      <p className="max-w-md text-pretty leading-relaxed text-body">
        The page you&apos;re looking for may have moved or no longer exists.
      </p>
      <LinkButton href="/" size="lg">
        Back to home
      </LinkButton>
    </section>
  )
}
