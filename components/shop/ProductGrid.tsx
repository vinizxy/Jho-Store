import type { Category, Product } from "@/lib/catalog/types"
import { ProductCard, type HeadingTag } from "./ProductCard"

type Props = {
  products: Product[]
  categories: Category[]
  priorityCount?: number
  titleAs?: HeadingTag
  hideBadge?: Product["badge"]
}

export function ProductGrid({ products, categories, priorityCount = 0, titleAs, hideBadge }: Props) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.slug}>
          <ProductCard
            product={p}
            category={bySlug.get(p.categorySlug)}
            priority={i < priorityCount}
            titleAs={titleAs}
            hideBadge={hideBadge}
          />
        </li>
      ))}
    </ul>
  )
}
