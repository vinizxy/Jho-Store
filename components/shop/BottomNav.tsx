"use client"

import { House, LayoutGrid, Search, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/lib/cart/CartProvider"

const items = [
  { href: "/", label: "Início", Icon: House },
  { href: "/categorias", label: "Categorias", Icon: LayoutGrid },
  { href: "/busca", label: "Busca", Icon: Search },
  { href: "/carrinho", label: "Carrinho", Icon: ShoppingBag },
]

export function BottomNav() {
  const pathname = usePathname()
  const { totals, hydrated } = useCart()
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid h-16 grid-cols-4">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
          const badge = href === "/carrinho" && hydrated && totals.count > 0 ? totals.count : null
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-xs ${
                  active ? "font-bold text-blue" : "font-medium text-ink"
                }`}
              >
                <span className="relative">
                  <Icon aria-hidden className="size-6" strokeWidth={active ? 2.5 : 2} />
                  {badge && (
                    <span className="absolute -top-2 -right-3 grid h-5 min-w-5 place-items-center rounded-full border-2 border-ink bg-lemon px-1 text-[11px] font-bold text-ink">
                      {badge}
                      <span className="sr-only"> itens</span>
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
