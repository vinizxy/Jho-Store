import { CategoryGrid } from "@/components/shop/CategoryGrid"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Section } from "@/components/shop/Section"
import { TrustBadges } from "@/components/shop/TrustBadges"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Mascot } from "@/components/ui/Mascot"
import { catalog } from "@/lib/catalog"
import { PIX_DISCOUNT } from "@/lib/config"

export default async function Home() {
  const [categories, deals, best] = await Promise.all([
    catalog.listCategories(),
    catalog.getDeals(8),
    catalog.getBestSellers(8),
  ])

  return (
    <>
      <section className="overflow-hidden border-b-2 border-ink bg-blue text-white [--focus:var(--color-white)]">
        <div className="container-page grid grid-cols-[1fr_auto] items-center gap-4 py-8 md:grid-cols-[1.4fr_1fr] md:gap-6 md:py-12">
          <div className="flex flex-col items-start gap-5">
            <Badge kind="pix">{Math.round(PIX_DISCOUNT * 100)}% off em tudo no Pix</Badge>
            <h1 className="text-[2rem] leading-[1.05] font-bold tracking-tight sm:text-4xl md:text-6xl">
              Tudo pra sua casa, <span className="text-sky">sem pesar no bolso.</span>
            </h1>
            <p className="max-w-[40ch] text-lg">Cozinha, ferramentas, eletrônicos, pet e muito mais, com entrega pra todo o Brasil.</p>
            <Button href="#ofertas" variant="dark">
              Ver ofertas do dia
            </Button>
          </div>
          {/* Palco azul-claro: a camiseta azul do mascote sumiria sobre o fundo azul. */}
          <div className="relative grid place-items-center justify-self-center">
            <div aria-hidden className="absolute top-[55%] left-1/2 size-32 -translate-1/2 rounded-full border-2 border-ink bg-sky shadow-brut md:size-80" />
            <Mascot pose="hero" priority className="relative h-48 w-auto md:h-[23rem]" />
          </div>
        </div>
      </section>

      <section aria-label="Categorias" className="container-page pt-6 md:pt-10">
        <CategoryGrid categories={categories} variant="strip" />
      </section>

      <Section title="Ofertas do dia" id="ofertas">
        <ProductGrid products={deals} categories={categories} priorityCount={2} />
      </Section>

      <TrustBadges />

      <Section title="Mais vendidos" id="mais-vendidos">
        <ProductGrid products={best} categories={categories} />
      </Section>
    </>
  )
}
