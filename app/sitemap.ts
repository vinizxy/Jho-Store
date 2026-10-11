import type { MetadataRoute } from "next"
import { catalog } from "@/lib/catalog"
import { SITE_URL } from "@/lib/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([catalog.listCategories(), catalog.listProducts({})])
  const paths = ["/", "/ofertas", "/categorias", ...categories.map((c) => `/c/${c.slug}`), ...products.map((p) => `/p/${p.slug}`)]
  return paths.map((p) => ({ url: new URL(p, SITE_URL).toString() }))
}
