import { EmptyState } from "@/components/shop/EmptyState"
import { SearchBar } from "@/components/shop/SearchBar"
import { Button } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <div className="container-page">
      <EmptyState
        as="h1"
        pose="404"
        title="Página não encontrada"
        text="O link pode ter mudado. Busque o que você precisa ou volte para o início."
        action={<Button href="/">Voltar ao início</Button>}
      >
        <SearchBar className="w-full max-w-md" />
      </EmptyState>
    </div>
  )
}
