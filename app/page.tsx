import { CategoryGrid } from "@/components/shop/CategoryGrid"
import { HeroStage } from "@/components/shop/HeroStage"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Section } from "@/components/shop/Section"
import { TrustBadges } from "@/components/shop/TrustBadges"
import { Button } from "@/components/ui/Button"
import { catalog } from "@/lib/catalog"

export default async function Home() {
  const [categories, deals, bestAll] = await Promise.all([
    catalog.listCategories(),
    catalog.getDeals(4),
    catalog.getBestSellers(12),
  ])
  // Um produto aparece uma vez só na home.
  const shown = new Set(deals.map((p) => p.slug))
  const best = bestAll.filter((p) => !shown.has(p.slug)).slice(0, 4)

  return (
    <>
      <section className="overflow-hidden border-b-2 border-ink bg-blue text-white [--focus:var(--color-white)]">
        {/* Texto com respiro em cima/embaixo; o palco do mascote encosta na borda de baixo. */}
        <div className="container-page grid grid-cols-[1fr_auto] items-stretch gap-2 md:grid-cols-[1.25fr_1fr] md:gap-6">
          <div className="flex flex-col items-start justify-center gap-5 py-8 md:py-16">
            <h1 className="text-[2rem] leading-[1.05] font-bold tracking-tight sm:text-4xl md:text-6xl">
              Tudo pra sua casa, <span className="text-sky">sem pesar no bolso.</span>
            </h1>
            <p className="max-w-[40ch] text-base md:text-lg">Cozinha, ferramentas, eletrônicos, pet e muito mais, com entrega pra todo o Brasil.</p>
            <Button href="/ofertas" variant="dark">
              Ver ofertas do dia
            </Button>
          </div>
          <HeroStage deals={deals} categories={categories} />
        </div>
      </section>

      {/* No desktop a barra preta do header já lista as categorias. */}
      <section aria-label="Categorias" className="container-page pt-6 md:pt-10 lg:hidden">
        <CategoryGrid categories={categories} variant="strip" />
      </section>

      <Section title="Ofertas do dia" id="ofertas" href="/ofertas" linkLabel="Ver todas as ofertas">
        <ProductGrid products={deals} categories={categories} priorityCount={2} />
      </Section>

      <Section title="Mais vendidos" id="mais-vendidos">
        <ProductGrid products={best} categories={categories} hideBadge="mais-vendido" />
      </Section>

      <TrustBadges />
    </>
  )
}
