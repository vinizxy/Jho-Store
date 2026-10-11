export type Tint = "sky" | "blue50" | "slate"

// Ícones lucide usados por categorias e produtos (placeholder até chegarem as fotos).
export type IconName =
  | "Armchair" | "Bed" | "BedDouble" | "Blinds" | "Blocks" | "Bone" | "Boxes" | "Brush" | "Briefcase" | "Cable"
  | "Car" | "Cat" | "ChefHat" | "CookingPot" | "Crosshair" | "Dice5" | "Dog" | "Drill" | "Flame" | "Footprints"
  | "Hand" | "Headphones" | "Lamp" | "Layers" | "LayoutGrid" | "Library" | "Microwave" | "Package" | "Palette"
  | "PawPrint" | "PlugZap" | "Puzzle" | "Ruler" | "ScanFace" | "Shirt" | "Sofa" | "Soup" | "Sparkles" | "Speaker"
  | "Utensils" | "Watch" | "Wind" | "Wrench"

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
  icon?: IconName // ícone do placeholder; sem ele, usa o da categoria
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
