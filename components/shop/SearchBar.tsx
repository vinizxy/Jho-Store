import Form from "next/form"
import { Search } from "lucide-react"
import { useId } from "react"

export function SearchBar({
  defaultValue,
  autoFocus,
  className = "",
}: {
  defaultValue?: string
  autoFocus?: boolean
  className?: string
}) {
  const id = useId()
  return (
    <Form action="/busca" role="search" className={`relative min-w-0 flex-1 ${className}`}>
      <label htmlFor={id} className="sr-only">
        Buscar produtos
      </label>
      <input
        id={id}
        type="search"
        name="q"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder="O que você procura?"
        enterKeyHint="search"
        autoComplete="off"
        className="h-12 w-full rounded-full border-2 border-ink bg-white pr-14 pl-5 text-base placeholder:text-muted focus-visible:outline-offset-0 [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute top-1 right-1 grid size-10 place-items-center rounded-full bg-blue text-white transition-colors hover:bg-ink"
      >
        <Search aria-hidden className="size-5" strokeWidth={2.5} />
      </button>
    </Form>
  )
}
