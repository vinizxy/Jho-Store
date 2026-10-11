import type { Category, Product } from "@/lib/catalog/types"
import { ProductCard } from "./ProductCard"

export function ProductGrid({ products, categories, priorityCount = 0 }: { products: Product[]; categories: Category[]; priorityCount?: number }) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.slug}>
          <ProductCard product={p} category={bySlug.get(p.categorySlug)} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  )
}
