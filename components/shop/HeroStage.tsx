import Link from "next/link"
import { CatalogIcon } from "@/components/ui/CatalogIcon"
import { Mascot } from "@/components/ui/Mascot"
import { formatBRL, pixPrice } from "@/lib/cart/pricing"
import type { Category, Product } from "@/lib/catalog/types"
import { PIX_DISCOUNT } from "@/lib/config"
import { tintBg } from "./ProductImage"

// Palco do hero: o mascote em pé na borda de baixo, falando com a pessoa, com ofertas reais "coladas" ao redor.
// Uma entrada só (hero-* em globals.css), desligada por prefers-reduced-motion.
export function HeroStage({ deals, categories }: { deals: Product[]; categories: Category[] }) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  const off = Math.round(PIX_DISCOUNT * 100)
  return (
    // flex-col justify-end: o mascote fica em pé na borda de baixo em qualquer altura de coluna
    <div className="group/stage relative flex h-full min-h-60 flex-col justify-end pt-10 md:min-h-[28rem] md:pt-12">
      {/* palco: círculo cortado pela borda de baixo do hero */}
      <div
        aria-hidden
        className="hero-stage absolute bottom-0 left-1/2 aspect-square w-[150%] -translate-x-1/2 translate-y-[38%] rounded-full border-2 border-ink bg-sky md:w-[115%]"
      />

      {/* O balão é posicionado em relação ao mascote (não ao palco), para ficar colado na cabeça em qualquer altura. */}
      <div className="relative mx-auto w-fit">
        {/* celular: em cima da cabeça · desktop: à direita da cabeça (o lado esquerdo é a mão que acena) */}
        <p className="hero-bubble absolute bottom-full left-1/2 z-10 mb-1 w-max max-w-[7.5rem] -translate-x-1/2 rounded-card border-2 border-ink bg-white px-3 py-1.5 text-xs leading-snug font-semibold text-ink shadow-brut-sm md:bottom-auto md:top-6 md:left-[72%] md:mb-0 md:max-w-[13rem] md:translate-x-0 md:px-4 md:py-3 md:text-base">
          <span className="md:hidden">{off}% off no Pix!</span>
          <span className="hidden md:inline">
            Oi! Hoje tem <strong className="rounded bg-lemon px-1">{off}% off</strong> em tudo no Pix.
          </span>
          <span aria-hidden className="absolute -bottom-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-ink bg-white md:hidden" />
          <span aria-hidden className="absolute bottom-3 -left-[9px] hidden size-4 rotate-45 border-b-2 border-l-2 border-ink bg-white md:block" />
        </p>
        <div className="hero-mascot origin-bottom transition-transform duration-200 ease-brut group-hover/stage:-rotate-2">
          <Mascot pose="hero" priority decorative={false} className="relative block h-56 w-auto translate-y-[2px] md:h-[25rem]" />
        </div>
      </div>

      {/* etiquetas de oferta reais (desktop) */}
      {deals.slice(0, 2).map((p, i) => {
        const cat = bySlug.get(p.categorySlug)
        return (
          <Link
            key={p.slug}
            href={`/p/${p.slug}`}
            style={{ animationDelay: `${700 + i * 120}ms` }}
            className={`hero-sticker brut-press absolute z-10 hidden w-44 items-center gap-2 rounded-card border-2 border-ink bg-white p-2 text-ink lg:flex ${
              i === 0 ? "bottom-16 -left-4 -rotate-6" : "right-0 bottom-28 rotate-6"
            }`}
          >
            <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${cat ? tintBg[cat.tint] : "bg-tint-sky"}`}>
              {(p.icon ?? cat?.icon) && <CatalogIcon name={(p.icon ?? cat?.icon)!} className="size-5" />}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-xs font-semibold">{p.name}</span>
              <span className="font-display text-base font-bold text-blue">{formatBRL(pixPrice(p.priceCents))}</span>
              <span className="text-[11px] font-semibold"> no Pix</span>
            </span>
          </Link>
        )
      })}
    </div>
  )
}
