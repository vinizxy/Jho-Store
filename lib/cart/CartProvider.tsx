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
  /** Muda a cada "add" para o anúncio; qty = total desse item no carrinho depois de adicionar. */
  lastAdded: { name: string; qty: number; at: number } | null
  /** Último item removido, para "Desfazer". */
  lastRemoved: CartItem | null
  undoRemove: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const noop = () => () => {}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const hydrated = useSyncExternalStore(noop, () => true, () => false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<CartContextValue["lastAdded"]>(null)
  const [lastRemoved, setLastRemoved] = useState<CartItem | null>(null)

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals: cartTotals(items),
      hydrated,
      add: (product, qty = 1) => {
        const { slug, name, priceCents, categorySlug } = product
        dispatch({ type: "add", item: { slug, name, priceCents, categorySlug }, qty })
        const now = getSnapshot().find((i) => i.slug === slug)?.qty ?? qty
        setLastAdded({ name, qty: now, at: Date.now() })
        setLastRemoved(null)
        setDrawerOpen(true)
      },
      remove: (slug) => {
        setLastRemoved(items.find((i) => i.slug === slug) ?? null)
        dispatch({ type: "remove", slug })
      },
      lastRemoved,
      undoRemove: () => {
        if (!lastRemoved) return
        const { qty, ...item } = lastRemoved
        dispatch({ type: "add", item, qty })
        setLastRemoved(null)
      },
      setQty: (slug, qty) => dispatch({ type: "setQty", slug, qty }),
      clear: () => dispatch({ type: "clear" }),
      drawerOpen,
      openDrawer: () => {
        setLastAdded(null)
        setDrawerOpen(true)
      },
      closeDrawer: () => setDrawerOpen(false),
      lastAdded,
    }),
    [items, hydrated, drawerOpen, lastAdded, lastRemoved],
  )

  return <CartContext value={value}>{children}</CartContext>
}

export function useCart(): CartContextValue {
  const ctx = use(CartContext)
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>")
  return ctx
}
