import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CatalogIcon } from "@/components/ui/CatalogIcon"
import { formatBRL, pixPrice } from "@/lib/cart/pricing"
import type { Category, Product } from "@/lib/catalog/types"
import { PIX_DISCOUNT } from "@/lib/config"
import { tintBg } from "./ProductImage"

// Lado direito do hero: 1 produto em destaque + 3 em lista. Hierarquia clara, uma entrada só (hero-drop).
export function HeroStage({ deals, categories }: { deals: Product[]; categories: Category[] }) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  const off = Math.round(PIX_DISCOUNT * 100)
  const [lead, ...rest] = deals.slice(0, 4)
  if (!lead) return null

  const tile = (p: Product) => {
    const cat = bySlug.get(p.categorySlug)
    const icon = p.icon ?? cat?.icon
    return { cls: cat ? tintBg[cat.tint] : "bg-tint-sky", icon }
  }
  const leadTile = tile(lead)

  return (
    <div className="flex flex-col gap-3 pt-6 pb-7 md:py-24">
      <Link
        href={`/p/${lead.slug}`}
        style={{ animationDelay: "60ms" }}
        className="hero-sticker brut-press relative flex items-center gap-4 rounded-card border-2 border-ink bg-white p-4 text-ink md:flex-col md:items-stretch md:gap-3 md:p-5"
      >
        <span className="absolute -top-3 right-3 rounded-lg border-2 border-ink bg-lemon px-2 py-0.5 font-display text-sm font-bold shadow-brut-sm">
          {off}% off no Pix
        </span>
        <span className={`grid size-20 shrink-0 place-items-center rounded-xl md:h-32 md:w-full ${leadTile.cls}`}>
          {leadTile.icon && <CatalogIcon name={leadTile.icon} className="size-9 md:size-14" />}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="line-clamp-2 block text-base font-semibold md:text-lg">{lead.name}</span>
          <span className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-blue md:text-3xl">{formatBRL(pixPrice(lead.priceCents))}</span>
            <span className="text-xs font-semibold">no Pix</span>
          </span>
        </span>
      </Link>

      <ul className="flex flex-col gap-2">
        {rest.map((p, i) => {
          const t = tile(p)
          return (
            <li key={p.slug}>
              <Link
                href={`/p/${p.slug}`}
                style={{ animationDelay: `${140 + i * 90}ms` }}
                className="hero-sticker brut-press flex items-center gap-3 rounded-card border-2 border-ink bg-white p-2 pr-3 text-ink"
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${t.cls}`}>
                  {t.icon && <CatalogIcon name={t.icon} className="size-5" />}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{p.name}</span>
                <span className="font-display text-base font-bold text-blue">{formatBRL(pixPrice(p.priceCents))}</span>
                <ArrowRight aria-hidden className="size-4 shrink-0" />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
