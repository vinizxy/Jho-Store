"use client"

import { createContext, use, useMemo, useState, useSyncExternalStore, type ReactNode } from "react"
import type { Product } from "@/lib/catalog/types"
import { cartTotals, type CartItem } from "./reducer"
import { dispatch, getServerSnapshot, getSnapshot, subscribe } from "./store"

type CartContextValue = {
  items: CartItem[]
  totals: ReturnType<typeof cartTotals>
  /** false no servidor e na hidratação; evita mostrar "carrinho vazio" antes de ler o navegador. */
  hydrated: boolean
  add: (product: Product, qty?: number) => void
  remove: (slug: string) => void
  setQty: (slug: string, qty: number) => void
  clear: () => void
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  /** Muda a cada "add" para o anúncio de leitor de tela. */
  lastAdded: { name: string; at: number } | null
}

const CartContext = createContext<CartContextValue | null>(null)
const noop = () => () => {}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const hydrated = useSyncExternalStore(noop, () => true, () => false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<CartContextValue["lastAdded"]>(null)

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals: cartTotals(items),
      hydrated,
      add: (product, qty = 1) => {
        const { slug, name, priceCents, categorySlug } = product
        dispatch({ type: "add", item: { slug, name, priceCents, categorySlug }, qty })
        setLastAdded({ name, at: Date.now() })
        setDrawerOpen(true)
      },
      remove: (slug) => dispatch({ type: "remove", slug }),
      setQty: (slug, qty) => dispatch({ type: "setQty", slug, qty }),
      clear: () => dispatch({ type: "clear" }),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      lastAdded,
    }),
    [items, hydrated, drawerOpen, lastAdded],
  )

  return <CartContext value={value}>{children}</CartContext>
}

export function useCart(): CartContextValue {
  const ctx = use(CartContext)
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>")
  return ctx
}
