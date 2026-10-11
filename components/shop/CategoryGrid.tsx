import Link from "next/link"
import { CatalogIcon } from "@/components/ui/CatalogIcon"
import type { Category } from "@/lib/catalog/types"
import { tintBg } from "./ProductImage"

export function CategoryGrid({ categories, variant }: { categories: Category[]; variant: "strip" | "grid" }) {
  const strip = variant === "strip"
  return (
    <ul
      className={
        strip
          ? "scroll-hint -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-8 md:overflow-visible md:px-0"
          : "grid grid-cols-2 gap-3 sm:grid-cols-4"
      }
    >
      {categories.map((c) => (
        <li key={c.slug} className={strip ? "shrink-0 snap-start" : ""}>
          <Link
            href={`/c/${c.slug}`}
            className={`brut-press flex flex-col items-center justify-center gap-2 rounded-card border-2 border-ink text-center font-semibold ${tintBg[c.tint]} ${
              strip ? "h-24 w-24 text-sm md:h-28 md:w-full" : "min-h-32 p-4 text-base"
            }`}
          >
            <CatalogIcon name={c.icon} className={strip ? "size-7" : "size-10"} />
            {c.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
