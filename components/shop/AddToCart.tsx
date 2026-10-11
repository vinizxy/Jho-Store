"use client"

import { ShoppingBag } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { useCart } from "@/lib/cart/CartProvider"
import { formatBRL, pixPrice } from "@/lib/cart/pricing"
import type { Product } from "@/lib/catalog/types"
import { QtyStepper } from "./QtyStepper"

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  return (
    // No mobile quem compra é a BuyBar fixa (um CTA por tela).
    <div className="hidden flex-wrap items-center gap-3 md:flex">
      <QtyStepper value={qty} onChange={setQty} label={product.name} />
      <Button onClick={() => add(product, qty)} className="flex-1 sm:flex-none">
        <ShoppingBag aria-hidden className="size-5" />
        Adicionar ao carrinho
      </Button>
    </div>
  )
}

// Barra fixa no mobile, acima da navegação inferior. A quantidade se ajusta no carrinho.
export function BuyBar({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 border-t-2 border-ink bg-white px-4 py-3 md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-xl leading-tight font-extrabold text-blue">{formatBRL(pixPrice(product.priceCents))}</p>
          <p className="text-xs text-muted">no Pix</p>
        </div>
        <Button onClick={() => add(product)}>
          <ShoppingBag aria-hidden className="size-5" />
          Adicionar ao carrinho
        </Button>
      </div>
    </div>
  )
}
