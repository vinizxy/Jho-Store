"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart/CartProvider"

export function CartButton() {
  const { totals, hydrated, openDrawer } = useCart()
  const count = hydrated ? totals.count : 0
  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Carrinho, ${count} ${count === 1 ? "item" : "itens"}`}
      className="brut-press relative grid size-12 shrink-0 place-items-center rounded-card border-2 border-ink bg-white"
    >
      <ShoppingBag aria-hidden className="size-6" strokeWidth={2} />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -top-2.5 -right-2.5 grid h-6 min-w-6 place-items-center rounded-full border-2 border-ink bg-lemon px-1 text-xs font-bold"
        >
          {count}
        </span>
      )}
    </button>
  )
}
