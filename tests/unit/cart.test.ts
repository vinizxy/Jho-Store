import { describe, expect, it } from "vitest"
import { cartReducer, cartTotals } from "@/lib/cart/reducer"
import { parseCart } from "@/lib/cart/storage"

const it1 = { slug: "a", name: "A", priceCents: 1000, categorySlug: "casa" }

describe("cartReducer", () => {
  const s = cartReducer(cartReducer([], { type: "add", item: it1 }), { type: "add", item: it1, qty: 2 })

  it("soma a quantidade ao adicionar o mesmo item", () => {
    expect(s).toEqual([{ ...it1, qty: 3 }])
  })

  it("limita a quantidade a 10", () => {
    expect(cartReducer(s, { type: "add", item: it1, qty: 50 })[0].qty).toBe(10)
    expect(cartReducer(s, { type: "setQty", slug: "a", qty: 999 })[0].qty).toBe(10)
  })

  it("remove quando a quantidade é 0, negativa ou inválida", () => {
    for (const q of [0, -1, NaN]) expect(cartReducer(s, { type: "setQty", slug: "a", qty: q })).toEqual([])
  })

  it("remove e limpa", () => {
    expect(cartReducer(s, { type: "remove", slug: "a" })).toEqual([])
    expect(cartReducer(s, { type: "clear" })).toEqual([])
  })

  it("calcula totais com desconto Pix sobre o subtotal", () => {
    expect(cartTotals([{ ...it1, qty: 3 }, { ...it1, slug: "b", priceCents: 999, qty: 1 }])).toEqual({
      count: 4,
      subtotalCents: 3999,
      pixDiscountCents: 200,
      pixTotalCents: 3799,
    })
  })
})

describe("parseCart", () => {
  it("volta vazio para nada ou JSON inválido", () => {
    expect(parseCart(null)).toEqual([])
    expect(parseCart("{oops")).toEqual([])
    expect(parseCart('{"a":1}')).toEqual([])
  })

  it("descarta itens inválidos e mantém os bons", () => {
    const raw = JSON.stringify([{ ...it1, qty: 2 }, { name: "sem slug", qty: 1 }, { ...it1, slug: "c", qty: -3 }])
    expect(parseCart(raw)).toEqual([{ ...it1, qty: 2 }])
  })
})
