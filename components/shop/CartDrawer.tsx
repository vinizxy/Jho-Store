"use client"

import { CircleCheck, X } from "lucide-react"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/Button"
import { useCart } from "@/lib/cart/CartProvider"
import type { Category } from "@/lib/catalog/types"
import { CartLine } from "./CartLine"
import { CartSummary } from "./CartSummary"
import { EmptyState } from "./EmptyState"

// <dialog> nativo: foco preso, Esc e retorno do foco vêm de graça.
export function CartDrawer({ categories }: { categories: Category[] }) {
  const ref = useRef<HTMLDialogElement>(null)
  const { items, totals, drawerOpen, closeDrawer, lastAdded } = useCart()
  const bySlug = new Map(categories.map((c) => [c.slug, c]))

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (drawerOpen && !d.open) d.showModal()
    if (!drawerOpen && d.open) d.close()
  }, [drawerOpen])

  return (
    <dialog
      ref={ref}
      aria-labelledby="cart-title"
      onClose={closeDrawer}
      onClick={(e) => e.target === ref.current && closeDrawer()}
      className="cart-drawer fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-md border-l-2 border-ink bg-paper p-0 text-ink backdrop:bg-ink/40 open:flex open:flex-col"
    >
      <div className="flex items-center justify-between border-b-2 border-ink bg-white px-5 py-3">
        <h2 id="cart-title" className="text-xl font-bold">
          Seu carrinho {totals.count > 0 && <span className="text-muted">({totals.count})</span>}
        </h2>
        <button type="button" onClick={closeDrawer} aria-label="Fechar carrinho" className="-mr-2 grid size-11 place-items-center rounded-card hover:bg-paper">
          <X aria-hidden className="size-6" />
        </button>
      </div>

      <p role="status" className="empty:hidden">
        {lastAdded && (
          <span key={lastAdded.at} className="flex items-center gap-2 bg-sky px-5 py-2.5 text-sm font-semibold">
            <CircleCheck aria-hidden className="size-5 shrink-0" />
            Adicionado ao carrinho
          </span>
        )}
      </p>

      {items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5">
          <EmptyState
            title="Seu carrinho está vazio"
            text="Que tal dar uma olhada nas ofertas do dia?"
            action={
              <Button href="/ofertas" onClick={closeDrawer}>
                Ver ofertas
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-ink/15 overflow-y-auto overscroll-contain px-5">
            {items.map((item) => (
              <CartLine key={item.slug} item={item} category={bySlug.get(item.categorySlug)} onNavigate={closeDrawer} />
            ))}
          </ul>
          <div className="flex flex-col gap-4 border-t-2 border-ink bg-white px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <CartSummary />
            <Button href="/checkout" onClick={closeDrawer} className="w-full">
              Finalizar compra
            </Button>
            <Button variant="ghost" onClick={closeDrawer} className="-mt-2 w-full">
              Continuar comprando
            </Button>
          </div>
        </>
      )}
    </dialog>
  )
}
