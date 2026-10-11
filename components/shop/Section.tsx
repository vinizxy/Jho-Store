import type { ReactNode } from "react"

export function Section({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-title`} id={id} className="container-page py-8 md:py-12">
      <h2 id={`${id}-title`} className="mb-5 text-2xl font-extrabold md:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  )
}
