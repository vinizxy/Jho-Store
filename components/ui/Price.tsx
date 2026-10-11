import { formatBRL, installments, pixPrice } from "@/lib/cart/pricing"

type Props = { cents: number; compareAtCents?: number; size?: "sm" | "lg" }

export function Price({ cents, compareAtCents, size = "sm" }: Props) {
  const { n, valueCents } = installments(cents)
  const lg = size === "lg"
  return (
    <div className="flex flex-col gap-0.5">
      {compareAtCents && (
        <s className={`text-muted ${lg ? "text-base" : "text-xs"}`}>
          <span className="sr-only">Preço antigo: </span>
          {formatBRL(compareAtCents)}
        </s>
      )}
      <p className={`font-display font-extrabold text-blue ${lg ? "text-4xl" : "text-xl"}`}>
        {formatBRL(pixPrice(cents))}
        <span className={`ml-1 font-sans font-semibold text-ink ${lg ? "text-base" : "text-xs"}`}>no Pix</span>
      </p>
      <p className={`text-muted ${lg ? "text-base" : "text-xs"}`}>
        {n === 1
          ? `ou ${formatBRL(cents)} no cartão`
          : `ou ${formatBRL(cents)} em até ${n}x de ${formatBRL(valueCents)} sem juros`}
      </p>
    </div>
  )
}
