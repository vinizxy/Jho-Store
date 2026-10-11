"use client"

import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useId } from "react"
import { listHref, type ListParams } from "@/lib/catalog/params"
import type { Sort } from "@/lib/catalog/types"

const options: { value: Sort; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "mais-vendidos", label: "Mais vendidos" },
]

export function SortSelect({ basePath, params, value }: { basePath: string; params: ListParams; value: Sort }) {
  const router = useRouter()
  const id = useId()
  return (
    <div className="flex items-center gap-2 self-end md:self-auto">
      <label htmlFor={id} className="text-sm font-semibold">
        Ordenar
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => router.push(listHref(basePath, { ...params, ordem: e.target.value }), { scroll: false })}
          className="h-11 appearance-none rounded-card border-2 border-ink bg-white pr-10 pl-3 text-sm font-semibold"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
      </div>
    </div>
  )
}
