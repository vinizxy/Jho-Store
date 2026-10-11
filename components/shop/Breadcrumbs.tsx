import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { SITE_URL } from "@/lib/config"
import { JsonLd } from "./JsonLd"

export type Crumb = { name: string; href?: string }

export function Breadcrumbs({ items, currentPath }: { items: Crumb[]; currentPath: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: new URL(c.href ?? currentPath, SITE_URL).toString(),
    })),
  }
  return (
    <nav aria-label="Você está em" className="text-sm">
      <JsonLd data={jsonLd} />
      <ol className="flex flex-wrap items-center gap-1 text-muted">
        {items.map((c, i) => (
          <li key={c.name} className="flex items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden className="size-4" />}
            {c.href ? (
              <Link href={c.href} className="inline-block py-2 underline-offset-4 hover:text-blue hover:underline">
                {c.name}
              </Link>
            ) : (
              <span aria-current="page" className="line-clamp-1 py-2 font-semibold text-ink">
                {c.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
