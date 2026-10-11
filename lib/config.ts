// Único lugar com valores de negócio. Mude aqui e o site inteiro acompanha.
export const BRAND = { name: "Jho Utilidades", short: "Jho" } as const

export const PIX_DISCOUNT = 0.05 // 5%
export const MAX_INSTALLMENTS = 6 // até 6x sem juros
export const MIN_INSTALLMENT_CENTS = 1000 // parcela mínima de R$ 10
export const MAX_QTY_PER_ITEM = 10

export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "" // vazio → links de WhatsApp somem
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export function whatsappUrl(text = ""): string | null {
  if (!WHATSAPP) return null
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
}
