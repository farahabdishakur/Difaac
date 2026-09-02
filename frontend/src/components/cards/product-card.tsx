import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getIcon } from '@/components/icons/icon-map'
import { ProductEmblem } from '@/components/product/product-emblem'
import { productAccent } from '@/lib/tone'
import type { Product } from '@/lib/data/products'

export function ProductCard({ product }: { product: Product }) {
  const Icon = getIcon(product.icon)
  // Each product's own accent, so the grid reads as six distinct products
  // rather than one repeated card — the same tone used on that product's
  // own page (see `productAccent`).
  const tone = productAccent[product.slug] ?? 'brand'

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col justify-between gap-6 rounded-[4px] border border-line bg-ink-2 p-6 lg:p-7 transition-all duration-200 hover:border-brand/60 hover:bg-ink-3"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <ProductEmblem icon={Icon} tone={tone} slug={product.slug} size="card" className="-m-1" />

          <span className="rounded-[2px] bg-[#070e17] border border-line px-2 py-0.5 text-[10px] font-mono text-muted-2 group-hover:text-brand group-hover:border-brand/40 transition-colors">
            ENTERPRISE
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h3 className="font-display text-lg font-bold leading-snug text-text group-hover:text-brand transition-colors">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-body">{product.tagline}</p>
        </div>
      </div>

      <span className="flex items-center gap-2 text-xs sm:text-sm font-mono font-medium text-brand transition-colors group-hover:text-brand-bright">
        <span>Explore Architecture</span>
        <ArrowRight
          className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  )
}


