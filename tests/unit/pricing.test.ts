import { describe, expect, it } from "vitest"
import { discountPercent, formatBRL, installments, pixPrice } from "@/lib/cart/pricing"

describe("pricing", () => {
  it("aplica 5% de desconto no Pix, arredondando para o centavo", () => {
    expect(pixPrice(9900)).toBe(9405)
    expect(pixPrice(999)).toBe(949)
  })

  it("parcela em até 6x respeitando a parcela mínima de R$ 10", () => {
    expect(installments(9900)).toEqual({ n: 6, valueCents: 1650 })
    expect(installments(990)).toEqual({ n: 1, valueCents: 990 })
    expect(installments(2500)).toEqual({ n: 2, valueCents: 1250 })
    expect(installments(1001)).toEqual({ n: 1, valueCents: 1001 })
    expect(installments(5999)).toEqual({ n: 5, valueCents: 1200 })
  })

  it("calcula o percentual de desconto", () => {
    expect(discountPercent(7990, 9990)).toBe(20)
  })

  it("formata em reais", () => {
    expect(formatBRL(9405).replace(/\s/g, " ")).toBe("R$ 94,05")
  })
})
