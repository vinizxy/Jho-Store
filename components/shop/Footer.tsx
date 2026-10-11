import { MessageCircle } from "lucide-react"
import Link from "next/link"
import type { Category } from "@/lib/catalog/types"
import { BRAND, MAX_INSTALLMENTS, PIX_DISCOUNT, whatsappUrl } from "@/lib/config"
import { Logo } from "./Header"

export function Footer({ categories }: { categories: Category[] }) {
  const wa = whatsappUrl(`Olá! Vim pelo site da ${BRAND.name}.`)
  return (
    <footer className="mt-16 bg-ink pb-16 text-white [--focus:var(--color-sky)] md:pb-0">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.2fr_2fr_1.2fr]">
        <div className="flex flex-col gap-3">
          <Logo tone="light" />
          <p className="max-w-[32ch] text-sm text-white/75">Utilidades para casa e para o dia a dia, com preço justo e entrega para todo o Brasil.</p>
        </div>

        <nav aria-label="Categorias no rodapé">
          <h2 className="mb-3 text-base font-bold">Categorias</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/c/${c.slug}`} className="inline-block py-1.5 hover:text-sky hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3 text-sm">
          <h2 className="text-base font-bold">Atendimento</h2>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-card border-2 border-white bg-sky px-4 font-semibold text-ink hover:bg-white"
            >
              <MessageCircle aria-hidden className="size-5" />
              Fale no WhatsApp
            </a>
          )}
          <p className="text-white/75">
            Pix com {Math.round(PIX_DISCOUNT * 100)}% de desconto ou cartão em até {MAX_INSTALLMENTS}x sem juros.
          </p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-page flex flex-col gap-1 py-5 text-xs text-white/75 sm:flex-row sm:justify-between">
          <p>© {BRAND.name}</p>
          <p>Protótipo: pagamento ainda não está ativo.</p>
        </div>
      </div>
    </footer>
  )
}
