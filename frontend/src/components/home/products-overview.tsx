'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { LinkButton } from '@/components/shared/link-button'
import { ProductCard } from '@/components/cards/product-card'
import { products } from '@/lib/data/products'

const categories = [
  { id: 'all', label: 'All Products', color: 'brand' },
  { id: 'threat-intel', label: 'Threat Intelligence', color: 'violet' },
  { id: 'fraud', label: 'Fraud Protection', color: 'blue' },
  { id: 'xdr', label: 'Managed XDR', color: 'brand' },
  { id: 'exposure', label: 'Exposure Management', color: 'cyan' },
  { id: 'protection', label: 'Risk Protection', color: 'rose' },
  { id: 'email', label: 'Email Protection', color: 'fuchsia' },
]

const productsByCategory: Record<string, string[]> = {
  'threat-intel': ['threat-intelligence'],
  'fraud': ['fraud-protection'],
  'xdr': ['managed-xdr'],
  'exposure': ['attack-surface-management'],
  'protection': ['digital-risk-protection'],
  'email': ['business-email-protection'],
}

export function ProductsOverview() {
  const [activeCategory, setActiveCategory] = useState('all')

  const displayedProducts =
    activeCategory === 'all' ? products : products.filter((p) => productsByCategory[activeCategory]?.includes(p.slug))

  return (
    <section className="bg-ink py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Products"
          title="The Difaac Platform"
          description="Modular security products designed to work together or integrate into your existing stack."
          action={
            <LinkButton href="/products" variant="secondary" size="sm" className="hidden sm:inline-flex">
              View all products
              <ArrowRight className="size-3.5" data-icon="inline-end" />
            </LinkButton>
          }
        />

        {/* Category tabs */}
        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-brand/20 text-brand border border-brand/50'
                  : 'bg-white/[0.03] text-body border border-line-soft hover:border-brand/30 hover:text-text'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}


