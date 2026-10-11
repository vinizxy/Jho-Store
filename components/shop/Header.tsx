import Link from "next/link"
import { Mascot } from "@/components/ui/Mascot"
import type { Category } from "@/lib/catalog/types"
import { BRAND } from "@/lib/config"
import { CartButton } from "./CartButton"
import { SearchBar } from "./SearchBar"

// Como na arte da marca: "Jho" em preto e o resto em azul. Sobre fundo escuro: branco e azul-claro.
export function Logo({ tone = "default" }: { tone?: "default" | "light" }) {
  const [first, ...rest] = BRAND.name.split(" ")
  const light = tone === "light"
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 rounded-card" aria-label={`${BRAND.name}, página inicial`}>
      <Mascot pose="avatar" className="size-10 rounded-full border-2 border-ink bg-ink" priority={!light} />
      <span aria-hidden className={`hidden font-display text-xl leading-none font-extrabold tracking-tight sm:inline ${light ? "text-white" : ""}`}>
        {first} <span className={light ? "text-sky" : "text-blue"}>{rest.join(" ")}</span>
      </span>
    </Link>
  )
}

export function Header({ categories }: { categories: Category[] }) {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-white">
      <div className="container-page flex h-[72px] items-center gap-3 md:gap-6">
        <Logo />
        <SearchBar className="md:max-w-xl" />
        <div className="ml-auto">
          <CartButton />
        </div>
      </div>
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
    </header>
  )
}
