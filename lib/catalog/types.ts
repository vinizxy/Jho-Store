export type Tint = "sky" | "lemon" | "blue50" | "slate"

export type IconName =
  | "Sofa"
  | "CookingPot"
  | "Wrench"
  | "Headphones"
  | "Sparkles"
  | "Puzzle"
  | "PawPrint"
  | "Boxes"

export type Category = { slug: string; name: string; icon: IconName; tint: Tint }

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  categorySlug: string
  priceCents: number // preço cheio (cartão)
  compareAtCents?: number // "de R$ X" em ofertas
  badge?: "oferta" | "mais-vendido" | "novo"
  images: string[] // vazio → placeholder estilizado
  specs: { label: string; value: string }[]
  soldCount: number
}

export const FILTERS = ["oferta", "ate-50", "ate-100"] as const
export type Filter = (typeof FILTERS)[number]

export const SORTS = ["relevancia", "menor-preco", "maior-preco", "mais-vendidos"] as const
export type Sort = (typeof SORTS)[number]

export type ListQuery = { category?: string; q?: string; filter?: Filter; sort?: Sort }

export interface CatalogRepository {
  listCategories(): Promise<Category[]>
  getCategory(slug: string): Promise<Category | null>
  listProducts(query: ListQuery): Promise<Product[]>
  getProduct(slug: string): Promise<Product | null>
  getRelated(product: Product, n: number): Promise<Product[]>
  getDeals(n: number): Promise<Product[]>
  getBestSellers(n: number): Promise<Product[]>
}
