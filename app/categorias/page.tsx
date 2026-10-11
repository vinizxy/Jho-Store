import type { Metadata } from "next"
import { CategoryGrid } from "@/components/shop/CategoryGrid"
import { catalog } from "@/lib/catalog"

export const metadata: Metadata = { title: "Categorias", alternates: { canonical: "/categorias" } }

export default async function CategoriesPage() {
  const categories = await catalog.listCategories()
  return (
    <div className="container-page flex flex-col gap-6 py-6 md:py-10">
      <h1 className="text-3xl font-bold md:text-5xl">Categorias</h1>
      <CategoryGrid categories={categories} variant="grid" />
    </div>
  )
}
