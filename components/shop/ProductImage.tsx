import Image from "next/image"
import { CatalogIcon } from "@/components/ui/CatalogIcon"
import type { Category, IconName, Tint } from "@/lib/catalog/types"

export const tintBg: Record<Tint, string> = {
  sky: "bg-tint-sky",
  blue50: "bg-tint-blue50",
  slate: "bg-tint-slate",
}

type Props = {
  name: string
  image?: string
  category?: Category
  sizes: string
  priority?: boolean
  /** Ícone do produto; sem ele, o da categoria. */
  icon?: IconName
  /** Miniatura: ícone pequeno. */
  compact?: boolean
  /** Mostra o nome da categoria embaixo do ícone (só na página do produto; nos cards repetiria o contexto). */
  label?: boolean
  className?: string
}

// Foto real quando existir; senão, placeholder na cor da categoria com ícone (nunca caixa cinza).
// O nome do produto vai no aria-label; visualmente ele já aparece logo abaixo, no card.
export function ProductImage({ name, image, icon, category, sizes, priority, compact, label, className = "" }: Props) {
  const frame = `relative aspect-square w-full overflow-hidden ${className}`
  if (image) {
    return (
      <div className={frame}>
        <Image src={image} alt={name} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    )
  }
  return (
    <div
      role="img"
      aria-label={name}
      className={`${frame} flex flex-col items-center justify-center gap-3 p-4 text-center ${tintBg[category?.tint ?? "sky"]}`}
    >
      {(icon ?? category?.icon) && <CatalogIcon name={(icon ?? category?.icon)!} className={compact ? "size-8" : "size-14 md:size-16"} />}
      {label && category && (
        <span aria-hidden className="font-display text-xs font-bold tracking-wide text-ink/70 uppercase">
          {category.name}
        </span>
      )}
    </div>
  )
}
