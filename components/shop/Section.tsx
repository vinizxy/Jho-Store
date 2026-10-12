import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

export function Section({
  title,
  id,
  href,
  linkLabel,
  children,
}: {
  title: string
  id: string
  href?: string
  linkLabel?: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={`${id}-title`} id={id} className="container-page py-8 md:py-12">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 id={`${id}-title`} className="text-2xl font-bold md:text-3xl">
          {title}
        </h2>
        {href && (
          <Link href={href} className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-blue hover:underline">
            <span className="sm:hidden">Ver todas</span>
            <span className="hidden sm:inline">{linkLabel}</span>
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
