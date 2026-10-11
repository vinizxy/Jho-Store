import { describe, expect, it } from "vitest"
import { formatCep, orderNumber, parseViaCep, UFS } from "@/lib/checkout"

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

  it("lê a resposta do ViaCEP só no formato esperado", () => {
    expect(parseViaCep({ logradouro: "Avenida Paulista", bairro: "Bela Vista", localidade: "São Paulo", uf: "SP" })).toEqual({
      endereco: "Avenida Paulista",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
    })
    expect(parseViaCep({ erro: true })).toBeNull()
    expect(parseViaCep({ localidade: "X", uf: "ZZ" })).toBeNull()
    expect(parseViaCep(null)).toBeNull()
    expect(parseViaCep("texto")).toBeNull()
    // CEP de cidade pequena: sem rua/bairro, mas com cidade e UF
    expect(parseViaCep({ logradouro: "", bairro: "", localidade: "Itu", uf: "sp" })).toEqual({ endereco: "", bairro: "", cidade: "Itu", uf: "SP" })
  })

  it("lista as 27 UFs", () => {
    expect(UFS).toHaveLength(27)
  })
})
