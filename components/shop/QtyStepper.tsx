import { Minus, Plus } from "lucide-react"
import { MAX_QTY_PER_ITEM } from "@/lib/config"

type Props = { value: number; onChange: (qty: number) => void; label: string; min?: number }

// Sem hooks: usável dentro de qualquer Client Component.
export function QtyStepper({ value, onChange, label, min = 1 }: Props) {
  const btn =
    "grid size-11 place-items-center rounded-card transition-colors hover:bg-tint-sky disabled:opacity-40 disabled:hover:bg-transparent"
  const atMax = value >= MAX_QTY_PER_ITEM
  return (
    <div className="flex flex-col items-start gap-1">
      <div role="group" aria-label={`Quantidade de ${label}`} className="inline-flex items-center rounded-card border-2 border-ink bg-white">
        <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Diminuir quantidade de ${label}`}>
          <Minus aria-hidden className="size-4" strokeWidth={2.5} />
        </button>
        <output aria-live="polite" className="w-8 text-center font-bold tabular-nums">
          {value}
        </output>
        <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={atMax} aria-label={`Aumentar quantidade de ${label}`}>
          <Plus aria-hidden className="size-4" strokeWidth={2.5} />
        </button>
      </div>
      {/* o + desabilitado sozinho não explica o porquê */}
      {atMax && <p className="text-xs text-muted">Máximo de {MAX_QTY_PER_ITEM} por pedido</p>}
    </div>
  )
}
