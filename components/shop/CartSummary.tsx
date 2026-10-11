"use client"

import { useCart } from "@/lib/cart/CartProvider"
import { formatBRL, installments } from "@/lib/cart/pricing"
import { PIX_DISCOUNT } from "@/lib/config"

export function CartSummary() {
  const { totals } = useCart()
  const { n, valueCents } = installments(totals.subtotalCents)
  return (
    <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 text-sm">
      <dt>Subtotal</dt>
      <dd className="text-right tabular-nums">{formatBRL(totals.subtotalCents)}</dd>
      <dt>Desconto Pix ({Math.round(PIX_DISCOUNT * 100)}%)</dt>
      <dd className="text-right tabular-nums">- {formatBRL(totals.pixDiscountCents)}</dd>
      <dt>Frete</dt>
      <dd className="text-right text-muted">calculado no checkout</dd>
      <dt className="mt-2 border-t-2 border-ink pt-3 font-display text-lg font-extrabold">Total no Pix</dt>
      <dd className="mt-2 border-t-2 border-ink pt-3 text-right font-display text-lg font-extrabold text-blue tabular-nums">
        {formatBRL(totals.pixTotalCents)}
      </dd>
      <dd className="col-span-2 text-right text-xs text-muted">
        {n === 1
          ? `ou ${formatBRL(totals.subtotalCents)} no cartão`
          : `ou ${formatBRL(totals.subtotalCents)} em até ${n}x de ${formatBRL(valueCents)} sem juros`}
      </dd>
    </dl>
  )
}
