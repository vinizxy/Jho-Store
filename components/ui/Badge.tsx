import type { ReactNode } from "react"

type Kind = "oferta" | "mais-vendido" | "novo" | "pix"

const styles: Record<Kind, string> = {
  oferta: "bg-lemon",
  pix: "bg-lemon",
  "mais-vendido": "bg-sky",
  novo: "bg-white",
}

const labels: Record<Kind, string> = { oferta: "Oferta", pix: "Pix", "mais-vendido": "Mais vendido", novo: "Novo" }

export function Badge({ kind, children, className = "" }: { kind: Kind; children?: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-bold text-ink ${styles[kind]} ${className}`}
    >
      {children ?? labels[kind]}
    </span>
  )
}
