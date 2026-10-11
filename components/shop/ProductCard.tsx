import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { Price } from "@/components/ui/Price"
import { discountPercent } from "@/lib/cart/pricing"
import type { Category, Product } from "@/lib/catalog/types"
import { ProductImage } from "./ProductImage"

export type HeadingTag = "h2" | "h3"

export function ProductCard({
  product,
  category,
  priority,
  titleAs: Title = "h3",
}: {
  product: Product
  category?: Category
  priority?: boolean
  /** h2 quando a grade vem logo abaixo do h1 da página (ordem de títulos). */
  titleAs?: HeadingTag
}) {
  const off = product.compareAtCents ? discountPercent(product.priceCents, product.compareAtCents) : 0
  return (
    <Link
      href={`/p/${product.slug}`}
      className="brut-press group flex h-full flex-col overflow-hidden rounded-card border-2 border-ink bg-white"
    >
      <div className="relative border-b-2 border-ink">
        <ProductImage
          name={product.name}
          image={product.images[0]}
          category={category}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          priority={priority}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {off > 0 && <Badge kind="oferta">-{off}%</Badge>}
          {product.badge && product.badge !== "oferta" && <Badge kind={product.badge} />}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <Title className="line-clamp-2 min-h-[2lh] font-sans text-sm leading-snug font-semibold group-hover:text-blue md:text-base">
          {product.name}
        </Title>
        <div className="mt-auto">
          <Price cents={product.priceCents} compareAtCents={product.compareAtCents} />
        </div>
      </div>
    </Link>
  )
}
