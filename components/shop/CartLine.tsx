"use client"

import { Trash2 } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart/CartProvider"
import { formatBRL, pixPrice } from "@/lib/cart/pricing"
import type { CartItem } from "@/lib/cart/reducer"
import type { Category } from "@/lib/catalog/types"
import { ProductImage } from "./ProductImage"
import { QtyStepper } from "./QtyStepper"

export function CartLine({ item, category, onNavigate }: { item: CartItem; category?: Category; onNavigate?: () => void }) {
  const { setQty, remove } = useCart()
  const href = `/p/${item.slug}`
  return (
    <li className="flex gap-3 py-4">
      <Link href={href} onClick={onNavigate} tabIndex={-1} aria-hidden className="w-20 shrink-0 self-start overflow-hidden rounded-card border-2 border-ink">
        <ProductImage name={item.name} category={category} sizes="80px" compact />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={href} onClick={onNavigate} className="line-clamp-2 text-sm font-semibold hover:text-blue">
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => remove(item.slug)}
            aria-label={`Remover ${item.name}`}
            className="-mt-2 -mr-2 grid size-11 shrink-0 place-items-center rounded-card text-muted hover:bg-white hover:text-ink"
          >
            <Trash2 aria-hidden className="size-5" />
          </button>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <QtyStepper value={item.qty} onChange={(q) => setQty(item.slug, q)} label={item.name} />
          {/* Pix em destaque, como no card e no produto: o preço não "sobe" ao entrar no carrinho. */}
          <p className="ml-auto text-right leading-tight whitespace-nowrap">
            <span className="block font-display font-bold text-blue tabular-nums">
              {formatBRL(pixPrice(item.priceCents * item.qty))} <span className="font-sans text-xs font-semibold text-ink">no Pix</span>
            </span>
            <span className="text-xs text-muted tabular-nums">{formatBRL(item.priceCents * item.qty)} no cartão</span>
          </p>
        </div>
      </div>
    </li>
  )
}
