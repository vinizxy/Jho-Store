import { MAX_INSTALLMENTS, MIN_INSTALLMENT_CENTS, PIX_DISCOUNT } from "@/lib/config"

// Todos os valores são centavos inteiros.

export function pixPrice(cents: number): number {
  return Math.round(cents * (1 - PIX_DISCOUNT))
}

export function installments(cents: number): { n: number; valueCents: number } {
  const n = Math.min(MAX_INSTALLMENTS, Math.max(1, Math.floor(cents / MIN_INSTALLMENT_CENTS)))
  // ceil: a soma das parcelas nunca fica abaixo do total
  return { n, valueCents: Math.ceil(cents / n) }
}

export function discountPercent(priceCents: number, compareAtCents: number): number {
  return Math.round((1 - priceCents / compareAtCents) * 100)
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function formatBRL(cents: number): string {
  return brl.format(cents / 100)
}
