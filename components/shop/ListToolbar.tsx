import { Chip } from "@/components/ui/Chip"
import { listHref, type ListParams } from "@/lib/catalog/params"
import type { Filter, Sort } from "@/lib/catalog/types"
import { SortSelect } from "./SortSelect"

const chips: { value?: Filter; label: string }[] = [
  { label: "Todos" },
  { value: "oferta", label: "Em oferta" },
  { value: "ate-50", label: "Até R$ 50" },
  { value: "ate-100", label: "Até R$ 100" },
]

// Filtros são links (funcionam sem JS, URL compartilhável). Só a ordenação usa JS.
export function ListToolbar({
  basePath,
  q,
  filter,
  sort,
  count,
}: {
  basePath: string
  q?: string
  filter?: Filter
  sort: Sort
  /** Mostrado na mesma linha da ordenação. */
  count?: number
}) {
  const params: ListParams = { q, f: filter, ordem: sort }
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <nav aria-label="Filtros">
        <ul className="scroll-hint -mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:px-0">
          {chips.map((c) => (
            <li key={c.label}>
              <Chip href={listHref(basePath, { ...params, f: c.value })} active={filter === c.value}>
                {c.label}
              </Chip>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center justify-between gap-3 md:justify-end">
        {count !== undefined && (
          <p className="text-sm text-muted md:hidden" aria-live="polite">
            {count} {count === 1 ? "produto" : "produtos"}
          </p>
        )}
        <SortSelect basePath={basePath} params={params} value={sort} />
      </div>
    </div>
  )
}
