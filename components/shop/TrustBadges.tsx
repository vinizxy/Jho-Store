import { QrCode, RefreshCw, Truck } from "lucide-react"
import Link from "next/link"
import { MAX_INSTALLMENTS, PIX_DISCOUNT } from "@/lib/config"

const items = [
  { Icon: QrCode, title: `${Math.round(PIX_DISCOUNT * 100)}% off no Pix`, text: `Ou em até ${MAX_INSTALLMENTS}x sem juros no cartão.`, bg: "bg-lemon" },
  { Icon: Truck, title: "Entrega pra todo o Brasil", text: "Frete calculado na hora de fechar o pedido.", bg: "bg-sky" },
  { Icon: RefreshCw, title: "Troca fácil", text: "Até 7 dias para devolver, sem complicação.", bg: "bg-white", href: "/trocas" },
]

export function TrustBadges() {
  return (
    <section aria-label="Vantagens" className="container-page py-8 md:py-12">
      <ul className="grid gap-4 md:grid-cols-3">
        {items.map(({ Icon, title, text, bg, href }: { Icon: typeof QrCode; title: string; text: string; bg: string; href?: string }) => (
          <li key={title} className="flex items-center gap-4">
            <span className={`grid size-14 shrink-0 place-items-center rounded-card border-2 border-ink shadow-brut-sm ${bg}`}>
              <Icon aria-hidden className="size-7" strokeWidth={2} />
            </span>
            <div>
              <p className="font-display text-lg font-bold">{title}</p>
              <p className="text-sm text-muted">
                {text}{" "}
                {href && (
                  <Link href={href} className="font-semibold text-blue underline underline-offset-4">
                    Como funciona
                  </Link>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
