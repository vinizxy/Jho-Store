import type { Category, Product } from "@/lib/catalog/types"
import { ProductCard, type HeadingTag } from "./ProductCard"

type Props = {
  products: Product[]
  categories: Category[]
  priorityCount?: number
  titleAs?: HeadingTag
  hideBadge?: Product["badge"]
  /** 1º produto em destaque (2x2 no desktop, linha cheia no celular). Pede 5 produtos; no tablet (3 colunas) cabem destaque + 2, o resto some para não sobrar buraco. */
  featureFirst?: boolean
}

export function ProductGrid({ products, categories, priorityCount = 0, titleAs, hideBadge, featureFirst }: Props) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((p, i) => (
        <li
          key={p.slug}
          className={featureFirst ? (i === 0 ? "col-span-2 md:row-span-2" : i >= 3 ? "md:max-lg:hidden" : "") : undefined}
        >
          <ProductCard
            product={p}
            category={bySlug.get(p.categorySlug)}
            priority={i < priorityCount}
            titleAs={titleAs}
            hideBadge={hideBadge}
            featured={featureFirst && i === 0}
          />
        </li>
      ))}
    </ul>
  )
}
