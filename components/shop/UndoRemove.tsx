"use client"

import { useCart } from "@/lib/cart/CartProvider"

// "Item removido · Desfazer": a lixeira remove na hora, então o erro de toque tem volta.
export function UndoRemove() {
  const { lastRemoved, undoRemove } = useCart()
  return (
    <p role="status" className="empty:hidden">
      {lastRemoved && (
        <span className="flex items-center justify-between gap-3 rounded-card bg-white px-4 py-2 text-sm">
          <span className="min-w-0 truncate">
            <strong className="font-semibold">Removido:</strong> {lastRemoved.name}
          </span>
          <button type="button" onClick={undoRemove} className="min-h-11 shrink-0 font-semibold text-blue underline underline-offset-4">
            Desfazer
          </button>
        </span>
      )}
    </p>
  )
}
