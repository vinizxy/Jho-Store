"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

// Checkout enxuto: o que é navegação da loja some, para a pessoa terminar a compra sem distração.
const FOCUSED = ["/checkout"]

export function ChromeGate({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const focused = FOCUSED.includes(usePathname())
  return focused ? fallback : children
}
