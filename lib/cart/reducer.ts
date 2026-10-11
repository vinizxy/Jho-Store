import { MAX_QTY_PER_ITEM } from "@/lib/config"
import { pixPrice } from "./pricing"

export type CartItem = { slug: string; name: string; priceCents: number; categorySlug: string; qty: number }

export type CartAction =
  | { type: "add"; item: Omit<CartItem, "qty">; qty?: number }
  | { type: "remove"; slug: string }
  | { type: "setQty"; slug: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] }

const clamp = (qty: number) => Math.min(MAX_QTY_PER_ITEM, Math.floor(qty))

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add": {
      const qty = action.qty ?? 1
      const found = state.find((i) => i.slug === action.item.slug)
      if (!found) return [...state, { ...action.item, qty: clamp(qty) }]
      return state.map((i) => (i === found ? { ...i, qty: clamp(i.qty + qty) } : i))
    }
    case "setQty":
      // !(qty >= 1) também pega NaN
      if (!(action.qty >= 1)) return state.filter((i) => i.slug !== action.slug)
      return state.map((i) => (i.slug === action.slug ? { ...i, qty: clamp(action.qty) } : i))
    case "remove":
      return state.filter((i) => i.slug !== action.slug)
    case "clear":
      return []
    case "hydrate":
      return action.items
  }
}

export function cartTotals(items: CartItem[]) {
  const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.qty, 0)
  const pixTotalCents = pixPrice(subtotalCents)
  return {
    count: items.reduce((sum, i) => sum + i.qty, 0),
    subtotalCents,
    pixDiscountCents: subtotalCents - pixTotalCents,
    pixTotalCents,
  }
}
