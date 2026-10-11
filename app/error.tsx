"use client"

import { EmptyState } from "@/components/shop/EmptyState"
import { Button } from "@/components/ui/Button"

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page">
      <EmptyState
        as="h1"
        pose="404"
        title="Algo deu errado"
        text="Não conseguimos carregar esta página agora."
        action={<Button onClick={reset}>Tentar de novo</Button>}
      />
    </div>
  )
}
