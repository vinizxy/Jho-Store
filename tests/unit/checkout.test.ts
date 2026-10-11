import { describe, expect, it } from "vitest"
import { formatCep, orderNumber, UFS } from "@/lib/checkout"

describe("checkout", () => {
  it("gera número de pedido legível", () => {
    expect(orderNumber(() => 0)).toBe("JHO-AAAAAA")
    expect(orderNumber()).toMatch(/^JHO-[A-Z0-9]{6}$/)
  })

  it("formata CEP aceitando qualquer entrada", () => {
    expect(formatCep("01310100")).toBe("01310-100")
    expect(formatCep("0131-0100abc99")).toBe("01310-100")
    expect(formatCep("013")).toBe("013")
    expect(formatCep("01310")).toBe("01310")
  })

  it("lista as 27 UFs", () => {
    expect(UFS).toHaveLength(27)
  })
})
