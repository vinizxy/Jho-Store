import { cartReducer, type CartAction, type CartItem } from "./reducer"
import { CART_KEY, parseCart } from "./storage"

// Store do carrinho fora do React, lida via useSyncExternalStore.
// Fonte da verdade: localStorage (com fallback em memória se estiver bloqueado).

const EMPTY: CartItem[] = []
let items: CartItem[] | null = null // null = ainda não lido do navegador
const listeners = new Set<() => void>()

function read(): CartItem[] {
  try {
    return parseCart(localStorage.getItem(CART_KEY))
  } catch {
    return EMPTY
  }
}

export function getSnapshot(): CartItem[] {
  return (items ??= read())
}

export function getServerSnapshot(): CartItem[] {
  return EMPTY
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  // outra aba mudou o carrinho
  const onStorage = (e: StorageEvent) => {
    if (e.key !== CART_KEY) return
    items = read()
    listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

export function dispatch(action: CartAction): void {
  items = cartReducer(getSnapshot(), action)
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {
    // sem persistência, segue em memória
  }
  listeners.forEach((l) => l())
}
