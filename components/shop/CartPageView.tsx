"use client"

import { Skeleton } from "@/components/ui/Skeleton"
import { Button } from "@/components/ui/Button"
import { useCart } from "@/lib/cart/CartProvider"
import type { Category } from "@/lib/catalog/types"
import { CartLine } from "./CartLine"
import { CartSummary } from "./CartSummary"
import { EmptyState } from "./EmptyState"
import { UndoRemove } from "./UndoRemove"

export function CartPageView({ categories }: { categories: Category[] }) {
  const { items, hydrated } = useCart()
  const bySlug = new Map(categories.map((c) => [c.slug, c]))

  if (!hydrated) return <Skeleton className="h-64 w-full" />

  if (items.length === 0) {
    return (
      <>
        <UndoRemove />
        <EmptyState
          as="h1"
          title="Seu carrinho está vazio"
          text="Que tal dar uma olhada nas ofertas do dia?"
          action={<Button href="/ofertas">Ver ofertas</Button>}
        />
      </>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_380px] md:items-start md:gap-10">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Seu carrinho</h1>
        <div className="mt-3 empty:hidden">
          <UndoRemove />
        </div>
        <ul className="mt-2 divide-y divide-ink/15">
          {items.map((item) => (
            <CartLine key={item.slug} item={item} category={bySlug.get(item.categorySlug)} />
          ))}
        </ul>
      </div>
      <aside aria-label="Resumo do pedido" className="flex flex-col gap-4 rounded-card border-2 border-ink bg-white p-5 shadow-brut md:sticky md:top-32">
        <CartSummary />
        <Button href="/checkout" className="w-full">
          Finalizar compra
        </Button>
      </aside>
    </div>
  )
}
