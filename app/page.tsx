import { CategoryGrid } from "@/components/shop/CategoryGrid"
import { HeroStage } from "@/components/shop/HeroStage"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Section } from "@/components/shop/Section"
import { TrustBadges } from "@/components/shop/TrustBadges"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { buttonClass } from "@/components/ui/Button"
import { catalog } from "@/lib/catalog"

export default async function Home() {
  const [categories, deals, bestAll] = await Promise.all([
    catalog.listCategories(),
    catalog.getDeals(4),
    catalog.getBestSellers(12),
  ])
  // Um produto aparece uma vez só na home.
  const shown = new Set(deals.map((p) => p.slug))
  const rest = bestAll.filter((p) => !shown.has(p.slug))
  const heroPicks = rest.slice(0, 4)
  const best = rest.slice(4, 9)

  return (
    <>
      <section className="overflow-hidden border-b-2 border-ink bg-sky text-ink">
        <div className="container-page grid grid-cols-1 items-center md:grid-cols-[1.25fr_1fr] md:gap-10">
          <div className="flex flex-col items-start justify-center gap-4 pt-7 md:gap-7 md:py-24">
            <h1 className="text-[2rem] leading-[1.05] font-bold tracking-tight sm:text-4xl md:text-6xl">
              Tudo pra sua casa, <span className="text-blue">sem pesar no bolso.</span>
            </h1>
            <p className="max-w-[40ch] text-base md:text-lg">Cozinha, ferramentas, eletrônicos, pet e muito mais, com entrega pra todo o Brasil.</p>
            <Link href="/ofertas" className={buttonClass("dark", "group min-h-14 gap-3 pr-2 pl-6")}>
              Ver ofertas do dia
              <span className="grid size-9 place-items-center rounded-card bg-white/15 transition-transform duration-200 ease-brut group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <ArrowRight aria-hidden className="size-5" />
              </span>
            </Link>
          </div>
          <HeroStage deals={heroPicks} categories={categories} />
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
        <ProductGrid products={best} categories={categories} hideBadge="mais-vendido" featureFirst />
      </Section>

      <TrustBadges />
    </>
  )
}
