import type { ReactNode } from "react"

type Kind = "oferta" | "mais-vendido" | "novo" | "pix"

// Amarelo é exclusivo do Pix; desconto usa preto para não virar o mesmo sinal.
const styles: Record<Kind, string> = {
  oferta: "bg-ink text-white",
  pix: "bg-lemon text-ink",
  "mais-vendido": "bg-sky text-ink",
  novo: "bg-white text-ink",
}

const labels: Record<Kind, string> = { oferta: "Oferta", pix: "Pix", "mais-vendido": "Mais vendido", novo: "Novo" }

export function Badge({ kind, children, className = "" }: { kind: Kind; children?: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-bold ${styles[kind]} ${className}`}
    >
      {children ?? labels[kind]}
    </span>
  )
}
