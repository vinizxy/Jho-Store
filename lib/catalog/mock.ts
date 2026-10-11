import { discountPercent, pixPrice } from "@/lib/cart/pricing"
import data from "./data.json"
import { searchProducts } from "./search"
import type { CatalogRepository, Category, Filter, Product, Sort } from "./types"

const categories = data.categories as Category[]
const products = data.products as Product[]

const byFilter: Record<Filter, (p: Product) => boolean> = {
  oferta: (p) => p.compareAtCents !== undefined,
  "ate-50": (p) => pixPrice(p.priceCents) <= 5000,
  "ate-100": (p) => pixPrice(p.priceCents) <= 10000,
}

const bySort: Record<Exclude<Sort, "relevancia">, (a: Product, b: Product) => number> = {
  "menor-preco": (a, b) => a.priceCents - b.priceCents,
  "maior-preco": (a, b) => b.priceCents - a.priceCents,
  "mais-vendidos": (a, b) => b.soldCount - a.soldCount,
}

const bestSellers = () => [...products].sort(bySort["mais-vendidos"])

export const mockCatalog: CatalogRepository = {
  async listCategories() {
    return categories
  },
  async getCategory(slug) {
    return categories.find((c) => c.slug === slug) ?? null
  },
  async listProducts({ category, q, filter, sort = "relevancia" }) {
    let list = q !== undefined ? searchProducts(products, categories, q) : products
    if (category) list = list.filter((p) => p.categorySlug === category)
    if (filter) list = list.filter(byFilter[filter])
    return sort === "relevancia" ? [...list] : [...list].sort(bySort[sort])
  },
  async getProduct(slug) {
    return products.find((p) => p.slug === slug) ?? null
  },
  async getRelated(product, n) {
    const same = products.filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    const fill = bestSellers().filter((p) => p.slug !== product.slug && !same.includes(p))
    return [...same, ...fill].slice(0, n)
  },
  async getDeals(n) {
    return products
      .filter((p) => p.compareAtCents !== undefined)
      .sort((a, b) => discountPercent(b.priceCents, b.compareAtCents!) - discountPercent(a.priceCents, a.compareAtCents!))
      .slice(0, n)
  },
  async getBestSellers(n) {
    return bestSellers().slice(0, n)
  },
}
