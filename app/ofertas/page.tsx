import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/shop/Breadcrumbs"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { catalog } from "@/lib/catalog"
import { BRAND } from "@/lib/config"

export const metadata: Metadata = {
  title: "Ofertas do dia",
  description: `Produtos com desconto na ${BRAND.name}, com 5% a mais no Pix.`,
  alternates: { canonical: "/ofertas" },
}

export default async function OffersPage() {
  const [deals, categories] = await Promise.all([catalog.getDeals(100), catalog.listCategories()])
  return (
    <div className="container-page flex flex-col gap-4 py-4 md:py-8">
      <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Ofertas do dia" }]} currentPath="/ofertas" />
      <h1 className="text-3xl font-bold md:text-5xl">Ofertas do dia</h1>
      <p className="text-sm text-muted">
        {deals.length} produtos com desconto, do maior para o menor. No Pix ainda tem 5% a mais.
      </p>
      <ProductGrid products={deals} categories={categories} priorityCount={2} titleAs="h2" />
    </div>
  )
}
