import { mockCatalog } from "./mock"
import type { CatalogRepository } from "./types"

// Único ponto de troca: quando o Supabase entrar, troque a implementação aqui.
export const catalog: CatalogRepository = mockCatalog

export type * from "./types"
