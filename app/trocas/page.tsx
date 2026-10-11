import { MessageCircle } from "lucide-react"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/shop/Breadcrumbs"
import { Mascot } from "@/components/ui/Mascot"
import { BRAND, whatsappUrl } from "@/lib/config"

export const metadata: Metadata = {
  title: "Trocas e devoluções",
  description: `Como trocar ou devolver um produto comprado na ${BRAND.name}.`,
  alternates: { canonical: "/trocas" },
}

// Só o que a lei garante (CDC arts. 49 e 26). A política própria da loja entra quando o dono definir.
const steps = [
  {
    title: "Desistiu da compra? Você tem 7 dias.",
    text: "Pelo Código de Defesa do Consumidor, compras feitas pela internet podem ser devolvidas em até 7 dias depois que o produto chega, sem precisar explicar o motivo. O valor pago volta inteiro.",
  },
  {
    title: "Veio com defeito?",
    text: "Avise em até 30 dias para produtos que acabam rápido (como cosméticos) e em até 90 dias para produtos duráveis (como eletrônicos e ferramentas). A gente troca, conserta ou devolve o dinheiro.",
  },
  {
    title: "Como pedir",
    text: "Mande o número do pedido e uma foto do produto pelo WhatsApp. Respondemos com o passo a passo para o envio.",
  },
]

export default function ExchangesPage() {
  const wa = whatsappUrl("Olá! Quero trocar ou devolver um produto. Meu pedido é: ")
  return (
    <div className="container-page flex max-w-3xl flex-col gap-6 py-4 md:py-8">
      <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Trocas e devoluções" }]} currentPath="/trocas" />
      <div className="flex items-center gap-4">
        <Mascot pose="avatar" className="size-16 shrink-0 rounded-full" />
        <h1 className="text-3xl font-bold md:text-5xl">Trocas e devoluções</h1>
      </div>
      <ol className="flex flex-col gap-4">
        {steps.map((s) => (
          <li key={s.title} className="rounded-card border-2 border-ink bg-white p-5">
            <h2 className="text-xl font-bold">{s.title}</h2>
            <p className="mt-2 max-w-[65ch] leading-relaxed">{s.text}</p>
          </li>
        ))}
      </ol>
      {wa && (
        <a href={wa} target="_blank" rel="noopener noreferrer" className="brut-press inline-flex min-h-12 w-fit items-center gap-2 rounded-card border-2 border-ink bg-blue px-5 font-display font-bold text-white">
          <MessageCircle aria-hidden className="size-5" />
          Pedir troca pelo WhatsApp
        </a>
      )}
    </div>
  )
}
