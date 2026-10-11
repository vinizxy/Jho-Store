import { describe, expect, it } from "vitest"
import data from "@/lib/catalog/data.json"
import { catalog } from "@/lib/catalog"
import { parseListParams } from "@/lib/catalog/params"
import { normalize, searchProducts } from "@/lib/catalog/search"
import type { Category, Product } from "@/lib/catalog/types"
import { pixPrice } from "@/lib/cart/pricing"

const P = data.products as Product[]
const C = data.categories as Category[]

describe("busca", () => {
  it("normaliza acentos, caixa e espaços", () => {
    expect(normalize("Eletrônicos  ")).toBe("eletronicos")
  })

  it("acha por nome e por categoria, sem acento", () => {
    const panelas = searchProducts(P, C, "panela")
    expect(panelas.length).toBeGreaterThan(0)
    expect(panelas.every((p) => normalize(p.name).includes("panela"))).toBe(true)
    expect(searchProducts(P, C, "eletronico").length).toBeGreaterThan(0)
  })

  it("exige todos os termos", () => {
    expect(searchProducts(P, C, "panela antiaderente").length).toBeLessThanOrEqual(
      searchProducts(P, C, "panela").length,
    )
    expect(searchProducts(P, C, "panela zzzz")).toEqual([])
  })

  it("não quebra com caracteres especiais e ignora busca vazia", () => {
    expect(() => searchProducts(P, C, "c++ (")).not.toThrow()
    expect(searchProducts(P, C, "   ")).toEqual([])
  })

  it("mostra primeiro quem casa no nome", () => {
    const r = searchProducts(P, C, "cozinha")
    expect(r.length).toBeGreaterThan(0)
  })
})

describe("parseListParams", () => {
  it("aceita valores válidos", () => {
    expect(parseListParams({ f: "oferta", ordem: "menor-preco" })).toEqual({
      filter: "oferta",
      sort: "menor-preco",
    })
  })

  it("cai no padrão com valores inválidos ou repetidos", () => {
    expect(parseListParams({ f: "xyz", ordem: ["abc", "menor-preco"] })).toEqual({
      filter: undefined,
      sort: "relevancia",
    })
  })
})

describe("catálogo mock", () => {
  it("ofertas têm preço de comparação, ordenadas por desconto", async () => {
    const deals = await catalog.getDeals(4)
    expect(deals).toHaveLength(4)
    expect(deals.every((p) => p.compareAtCents)).toBe(true)
  })

  it("mais vendidos em ordem decrescente", async () => {
    const best = await catalog.getBestSellers(5)
    expect(best.map((p) => p.soldCount)).toEqual([...best.map((p) => p.soldCount)].sort((a, b) => b - a))
  })

  it("filtra por faixa de preço Pix", async () => {
    const cheap = await catalog.listProducts({ filter: "ate-50" })
    expect(cheap.length).toBeGreaterThan(0)
    expect(cheap.every((p) => pixPrice(p.priceCents) <= 5000)).toBe(true)
  })

  it("ordena por preço dentro da categoria", async () => {
    const asc = await catalog.listProducts({ category: "cozinha", sort: "menor-preco" })
    expect(asc).toHaveLength(5)
    expect(asc.map((p) => p.priceCents)).toEqual([...asc.map((p) => p.priceCents)].sort((a, b) => a - b))
  })

  it("devolve null para slug inexistente", async () => {
    expect(await catalog.getProduct("nao-existe")).toBeNull()
    expect(await catalog.getCategory("nao-existe")).toBeNull()
  })

  it("relacionados não incluem o próprio produto", async () => {
    const p = (await catalog.listProducts({}))[0]
    const rel = await catalog.getRelated(p, 4)
    expect(rel).toHaveLength(4)
    expect(rel.some((r) => r.slug === p.slug)).toBe(false)
  })

  it("dados consistentes: slugs únicos e categorias existentes", () => {
    expect(new Set(P.map((p) => p.slug)).size).toBe(P.length)
    const cats = new Set(C.map((c) => c.slug))
    expect(P.every((p) => cats.has(p.categorySlug))).toBe(true)
  })
})
