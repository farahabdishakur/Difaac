import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { LinkButton } from '@/components/shared/link-button'
import { ProductCard } from '@/components/cards/product-card'
import { products } from '@/lib/data/products'

export function ProductsOverview() {
  return (
    <section className="bg-ink py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Products"
          title="The Difaac platform"
          description="Modular security products designed to work together or integrate into your existing stack."
          action={
            <LinkButton href="/products" variant="secondary" size="sm" className="hidden sm:inline-flex">
              View all products
              <ArrowRight className="size-3.5" data-icon="inline-end" />
            </LinkButton>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}


