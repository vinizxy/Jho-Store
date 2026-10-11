import Link from "next/link"
import type { ReactNode } from "react"

export function Chip({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 shrink-0 items-center rounded-full border-2 border-ink px-4 text-sm font-semibold whitespace-nowrap transition-[background-color,box-shadow,translate] duration-150 ${
        active ? "bg-sky shadow-brut-sm" : "bg-white hover:bg-tint-sky"
      }`}
    >
      {children}
    </Link>
  )
}
