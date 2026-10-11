import { FILTERS, SORTS, type Filter, type Sort } from "./types"

type SearchParams = Record<string, string | string[] | undefined>

function pick<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : undefined
}

// Lê `?f=` e `?ordem=` da URL. Qualquer coisa inválida vira o padrão.
export function parseListParams(sp: SearchParams): { filter?: Filter; sort: Sort } {
  return { filter: pick(sp.f, FILTERS), sort: pick(sp.ordem, SORTS) ?? "relevancia" }
}

export function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : ""
}
