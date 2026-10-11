import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

type Variant = "primary" | "secondary" | "ghost"

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-card px-5 font-display text-base font-bold whitespace-nowrap disabled:pointer-events-none disabled:opacity-50"

const variants: Record<Variant, string> = {
  primary: "brut-press border-2 border-ink bg-blue text-white",
  secondary: "brut-press border-2 border-ink bg-white text-ink",
  ghost: "text-blue underline-offset-4 hover:underline",
}

export function buttonClass(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`
}

type Props = { variant?: Variant; className?: string; children: ReactNode } & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<ComponentProps<"button">, "className">)
)

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const cls = buttonClass(variant, className)
  if (props.href !== undefined) return <Link {...props} className={cls} />
  const { type = "button", ...rest } = props
  return <button type={type} {...rest} className={cls} />
}
