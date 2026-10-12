import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { Price } from "@/components/ui/Price"
import { discountPercent } from "@/lib/cart/pricing"
import type { Category, Product } from "@/lib/catalog/types"
import { ProductImage } from "./ProductImage"

export type HeadingTag = "h2" | "h3"

export function ProductCard({
  product,
  category,
  priority,
  titleAs: Title = "h3",
  hideBadge,
  featured,
}: {
  product: Product
  category?: Category
  priority?: boolean
  /** h2 quando a grade vem logo abaixo do h1 da página (ordem de títulos). */
  titleAs?: HeadingTag
  /** Selo redundante no contexto (ex.: "Mais vendido" dentro de "Mais vendidos"). */
  hideBadge?: Product["badge"]
  /** Destaque da grade: ocupa 2 colunas; no celular a imagem fica mais baixa. */
  featured?: boolean
}) {
  const off = product.compareAtCents ? discountPercent(product.priceCents, product.compareAtCents) : 0
  // No máximo 1 selo por card; desconto tem prioridade.
  const badge = off > 0 ? null : product.badge && product.badge !== hideBadge && product.badge !== "oferta" ? product.badge : null
  return (
    <Link
      href={`/p/${product.slug}`}
      className="brut-press group flex h-full flex-col overflow-hidden rounded-card border-2 border-ink bg-white"
    >
      <div className="relative border-b-2 border-ink">
        <ProductImage
          name={product.name}
          image={product.images[0]}
          icon={product.icon}
          category={category}
          sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"}
          className={featured ? "max-md:aspect-[2/1]" : ""}
          priority={priority}
        />
        <div className="absolute top-2 left-2">
          {off > 0 && <Badge kind="oferta">-{off}%</Badge>}
          {badge && <Badge kind={badge} />}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <Title
          className={`font-sans leading-snug font-semibold group-hover:text-blue ${featured ? "line-clamp-2 text-base md:text-xl" : "line-clamp-3 min-h-[3lh] text-sm md:line-clamp-2 md:min-h-[2lh] md:text-base"}`}
        >
          {product.name}
        </Title>
        <div className="mt-auto">
          <Price cents={product.priceCents} />
        </div>
      </div>
    </Link>
  )
}
