import { MAX_QTY_PER_ITEM } from "@/lib/config"
import type { CartItem } from "./reducer"

export const CART_KEY = "jho-cart-v1"

function isItem(x: unknown): x is CartItem {
  if (typeof x !== "object" || x === null) return false
  const i = x as Record<string, unknown>
  return (
    typeof i.slug === "string" &&
    typeof i.name === "string" &&
    typeof i.categorySlug === "string" &&
    Number.isInteger(i.priceCents) &&
    (i.priceCents as number) >= 0 &&
    Number.isInteger(i.qty) &&
    (i.qty as number) >= 1 &&
    (i.qty as number) <= MAX_QTY_PER_ITEM
  )
}

// O que vem do localStorage é dado não confiável: valida item a item.
export function parseCart(raw: string | null): CartItem[] {
  if (!raw) return []
  try {
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data.filter(isItem).map(({ slug, name, priceCents, categorySlug, qty }) => ({
      slug,
      name,
      priceCents,
      categorySlug,
      qty,
    }))
  } catch {
    return []
  }
}
