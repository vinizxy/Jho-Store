import { FILTERS, SORTS, type Filter, type Sort } from "./types"

type SearchParams = Record<string, string | string[] | undefined>

function pick<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : undefined
}

// Lê `?f=` e `?ordem=` da URL. Qualquer coisa inválida vira o padrão.
export function parseListParams(sp: SearchParams): { filter?: Filter; sort: Sort } {
  return { filter: pick(sp.f, FILTERS), sort: pick(sp.ordem, SORTS) ?? "relevancia" }
}

export type ListParams = { q?: string; f?: string; ordem?: string }

// Monta a URL de uma listagem omitindo valores vazios e o padrão (relevância).
export function listHref(basePath: string, params: ListParams): string {
  const sp = new URLSearchParams()
  if (params.q) sp.set("q", params.q)
  if (params.f) sp.set("f", params.f)
  if (params.ordem && params.ordem !== "relevancia") sp.set("ordem", params.ordem)
  const qs = sp.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : ""
}
