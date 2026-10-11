import type { Metadata } from "next"
import { Suspense } from "react"
import { CategoryGrid } from "@/components/shop/CategoryGrid"
import { EmptyState } from "@/components/shop/EmptyState"
import { GridSkeleton } from "@/components/shop/GridSkeleton"
import { ListToolbar } from "@/components/shop/ListToolbar"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { SearchBar } from "@/components/shop/SearchBar"
import { catalog } from "@/lib/catalog"
import { firstParam, parseListParams } from "@/lib/catalog/params"

export const metadata: Metadata = { title: "Busca", robots: { index: false } }

export default function SearchPage({ searchParams }: PageProps<"/busca">) {
  return (
    <div className="container-page flex flex-col gap-5 py-6 md:py-10">
      <h1 className="sr-only">Buscar produtos</h1>
      <Suspense
        fallback={
          <>
            <SearchBar className="md:max-w-2xl" />
            <GridSkeleton />
          </>
        }
      >
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function Suggestions() {
  const [categories, best] = await Promise.all([catalog.listCategories(), catalog.getBestSellers(4)])
  return (
    <>
      <section aria-labelledby="sug-cat" className="flex flex-col gap-4">
        <h2 id="sug-cat" className="text-xl font-extrabold">
          Navegue por categoria
        </h2>
        <CategoryGrid categories={categories} variant="strip" />
      </section>
      <section aria-labelledby="sug-best" className="flex flex-col gap-4">
        <h2 id="sug-best" className="text-xl font-extrabold">
          Mais vendidos
        </h2>
        <ProductGrid products={best} categories={categories} />
      </section>
    </>
  )
}

async function SearchResults({ searchParams }: { searchParams: PageProps<"/busca">["searchParams"] }) {
  const sp = await searchParams
  const q = firstParam(sp.q).trim()
  const { filter, sort } = parseListParams(sp)

  const search = <SearchBar defaultValue={q} autoFocus={!q} className="md:max-w-2xl" />
  if (!q) {
    return (
      <>
        {search}
        <Suggestions />
      </>
    )
  }

  const [products, categories] = await Promise.all([
    catalog.listProducts({ q, filter, sort }),
    catalog.listCategories(),
  ])

  if (products.length === 0 && !filter) {
    return (
      <>
        {search}
        <EmptyState title={`Não achamos “${q}”`} text="Tente outra palavra ou veja as categorias." />
        <Suggestions />
      </>
    )
  }

  return (
    <>
      {search}
      <p className="text-2xl font-extrabold" aria-live="polite">
        {products.length} {products.length === 1 ? "resultado" : "resultados"} para “{q}”
      </p>
      <ListToolbar basePath="/busca" q={q} filter={filter} sort={sort} />
      {products.length > 0 ? (
        <ProductGrid products={products} categories={categories} priorityCount={2} />
      ) : (
        <EmptyState title="Nenhum produto com esse filtro" text="Tente outro filtro." />
      )}
    </>
  )
}
