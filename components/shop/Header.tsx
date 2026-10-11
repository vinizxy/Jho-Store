import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Mascot } from "@/components/ui/Mascot"
import type { Category } from "@/lib/catalog/types"
import { BRAND } from "@/lib/config"
import { CartButton } from "./CartButton"
import { ChromeGate } from "./ChromeGate"
import { SearchBar } from "./SearchBar"

// Fundo claro: a logo oficial (avatar no celular, para a busca caber).
// Fundo escuro: avatar + nome em texto, "Jho" branco e o resto em azul-claro (a arte tem letras escuras).
export function Logo({ tone = "default" }: { tone?: "default" | "light" }) {
  const [first, ...rest] = BRAND.name.split(" ")
  const label = `${BRAND.name}, página inicial`
  if (tone === "light") {
    return (
      <Link href="/" className="flex w-fit shrink-0 items-center gap-2 rounded-card" aria-label={label}>
        <Mascot pose="avatar" className="size-11 rounded-full ring-2 ring-sky" />
        <span aria-hidden className="font-display text-2xl leading-none font-bold text-white">
          {first} <span className="text-sky">{rest.join(" ")}</span>
        </span>
      </Link>
    )
  }
  return (
    <Link href="/" className="flex shrink-0 items-center rounded-card" aria-label={label}>
      <Mascot pose="avatar" priority className="size-11 rounded-full sm:hidden" />
      <Image src="/brand/logo.webp" alt="" width={613} height={218} priority className="hidden h-14 w-auto sm:block" />
    </Link>
  )
}

export function Header({ categories }: { categories: Category[] }) {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-white">
      <div className="container-page flex h-[72px] items-center gap-3 md:gap-6">
        <Logo />
        <ChromeGate
          fallback={
            <Link href="/carrinho" className="ml-auto inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-blue hover:underline">
              <ChevronLeft aria-hidden className="size-4" />
              Voltar ao carrinho
            </Link>
          }
        >
          <SearchBar className="md:max-w-xl" />
          <div className="ml-auto">
            <CartButton />
          </div>
        </ChromeGate>
      </div>
      <ChromeGate>
        <CategoryBar categories={categories} />
      </ChromeGate>
    </header>
  )
}

function CategoryBar({ categories }: { categories: Category[] }) {
  return (
      <nav aria-label="Categorias" className="hidden bg-ink text-white lg:block">
        <ul className="container-page flex h-11 items-center gap-7 text-sm font-semibold">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/c/${c.slug}`} className="py-2 underline-offset-4 hover:text-sky hover:underline">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
  )
}
