import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Breadcrumbs } from "@/components/shop/Breadcrumbs"
import { EmptyState } from "@/components/shop/EmptyState"
import { GridSkeleton } from "@/components/shop/GridSkeleton"
import { ListToolbar } from "@/components/shop/ListToolbar"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Button } from "@/components/ui/Button"
import { catalog } from "@/lib/catalog"
import { BRAND } from "@/lib/config"
import { parseListParams } from "@/lib/catalog/params"
import type { Category } from "@/lib/catalog/types"

export async function generateStaticParams() {
  return (await catalog.listCategories()).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps<"/c/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const category = await catalog.getCategory(slug)
  if (!category) return {}
  return {
    title: category.name,
    description: `${category.name} com 5% de desconto no Pix e até 6x sem juros na ${BRAND.name}.`,
    alternates: { canonical: `/c/${slug}` },
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/c/[slug]">) {
  const { slug } = await params
  const category = await catalog.getCategory(slug)
  if (!category) notFound()

  return (
    <div className="container-page flex flex-col gap-4 py-4 md:py-8">
      <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: category.name }]} currentPath={`/c/${slug}`} />
      <h1 className="text-3xl font-bold md:text-5xl">{category.name}</h1>
      <Suspense fallback={<GridSkeleton />}>
        <CategoryResults category={category} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function CategoryResults({
  category,
  searchParams,
}: {
  category: Category
  searchParams: PageProps<"/c/[slug]">["searchParams"]
}) {
  const { filter, sort } = parseListParams(await searchParams)
  const [products, categories] = await Promise.all([
    catalog.listProducts({ category: category.slug, filter, sort }),
    catalog.listCategories(),
  ])
  const basePath = `/c/${category.slug}`

  return (
    <>
      <ListToolbar basePath={basePath} filter={filter} sort={sort} />
      <p className="text-sm text-muted" aria-live="polite">
        {products.length} {products.length === 1 ? "produto" : "produtos"}
      </p>
      {products.length > 0 ? (
        <ProductGrid products={products} categories={categories} priorityCount={2} titleAs="h2" />
      ) : (
        <EmptyState
          title="Nenhum produto com esse filtro"
          text="Tente outro filtro ou veja tudo da categoria."
          action={<Button href={basePath}>Ver todos</Button>}
        />
      )}
    </>
  )
}
