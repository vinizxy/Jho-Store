import type { Category, Product } from "./types"

export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim()
}

// Busca simples por termos (AND). Só `includes`: nada do input vira RegExp.
export function searchProducts(products: Product[], categories: Category[], q: string): Product[] {
  const terms = normalize(q).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []
  const catName = new Map(categories.map((c) => [c.slug, c.name]))

  const nameHits: Product[] = []
  const otherHits: Product[] = []
  for (const p of products) {
    const name = normalize(p.name)
    const haystack = `${name} ${normalize(catName.get(p.categorySlug) ?? "")} ${normalize(p.description)}`
    if (!terms.every((t) => haystack.includes(t))) continue
    ;(terms.some((t) => name.includes(t)) ? nameHits : otherHits).push(p)
  }
  return [...nameHits, ...otherHits]
}
