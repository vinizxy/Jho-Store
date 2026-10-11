// Sem 0/O/1/I para o número não gerar confusão ao ser ditado no WhatsApp.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function orderNumber(rand: () => number = Math.random): string {
  let id = ""
  for (let i = 0; i < 6; i++) id += ALPHABET[Math.floor(rand() * ALPHABET.length)]
  return `JHO-${id}`
}

export function formatCep(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export function formatPhone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export type Address = { endereco: string; bairro: string; cidade: string; uf: string }

// Resposta do ViaCEP é dado externo: só aceita o formato esperado. CEP inexistente vem como { erro: true }.
export function parseViaCep(data: unknown): Address | null {
  if (typeof data !== "object" || data === null) return null
  const d = data as Record<string, unknown>
  if (d.erro) return null
  const str = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 120) : "")
  const uf = str(d.uf).toUpperCase()
  if (!(UFS as readonly string[]).includes(uf)) return null
  return { endereco: str(d.logradouro), bairro: str(d.bairro), cidade: str(d.localidade), uf }
}

export async function lookupCep(cep: string, signal?: AbortSignal): Promise<Address | null> {
  const digits = cep.replace(/\D/g, "")
  if (digits.length !== 8) return null
  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal })
  if (!res.ok) return null
  return parseViaCep(await res.json())
}

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const
