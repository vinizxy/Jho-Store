"use client"

import { CircleAlert, CreditCard, QrCode } from "lucide-react"
import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Mascot } from "@/components/ui/Mascot"
import { Skeleton } from "@/components/ui/Skeleton"
import { useCart } from "@/lib/cart/CartProvider"
import { formatBRL, installments, pixPrice } from "@/lib/cart/pricing"
import { formatCep, formatPhone, lookupCep, orderNumber, UFS } from "@/lib/checkout"
import { PIX_DISCOUNT } from "@/lib/config"
import { EmptyState } from "./EmptyState"

type FieldDef = {
  name: string
  label: string
  required?: string // mensagem quando vazio; ausente = opcional
  invalid?: string // mensagem quando o formato está errado
}

const FIELDS: Record<string, FieldDef> = {
  nome: { name: "nome", label: "Nome completo", required: "Informe seu nome." },
  email: { name: "email", label: "E-mail", required: "Informe seu e-mail.", invalid: "Digite um e-mail válido, como nome@email.com." },
  celular: { name: "celular", label: "Celular (WhatsApp)", required: "Informe seu celular.", invalid: "Celular com DDD, como (11) 98765-4321." },
  cep: { name: "cep", label: "CEP", required: "Informe o CEP.", invalid: "O CEP tem 8 números, como 01310-100." },
  endereco: { name: "endereco", label: "Endereço", required: "Informe a rua ou avenida." },
  numero: { name: "numero", label: "Número", required: "Informe o número." },
  complemento: { name: "complemento", label: "Complemento (opcional)" },
  bairro: { name: "bairro", label: "Bairro", required: "Informe o bairro." },
  cidade: { name: "cidade", label: "Cidade", required: "Informe a cidade." },
  uf: { name: "uf", label: "Estado", required: "Escolha o estado." },
}

// Erro tem linguagem própria (tracejado + ícone + texto preto), separada do azul de marca/seleção.
const inputCls =
  "h-12 w-full rounded-card border-2 border-ink bg-white px-3 text-base aria-invalid:border-dashed aria-invalid:bg-paper focus-visible:outline-offset-0"

function message(el: HTMLInputElement | HTMLSelectElement): string {
  const def = FIELDS[el.name]
  if (!def || el.validity.valid) return ""
  return el.validity.valueMissing ? (def.required ?? "") : (def.invalid ?? def.required ?? "")
}

function Field({ def, error, children, className = "" }: { def: FieldDef; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={def.name} className="text-sm font-semibold">
        {def.label}
      </label>
      {children}
      {error && (
        <p id={`${def.name}-erro`} className="flex items-start gap-1.5 text-sm font-semibold">
          <CircleAlert aria-hidden className="mt-px size-4 shrink-0" strokeWidth={2.5} />
          {error}
        </p>
      )}
    </div>
  )
}

export function CheckoutForm() {
  const { items, totals, hydrated, clear } = useCart()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tried, setTried] = useState(false)
  const [payment, setPayment] = useState<"pix" | "cartao">("pix")
  const [cep, setCep] = useState("")
  const [phone, setPhone] = useState("")
  const [uf, setUf] = useState("")
  const [addr, setAddr] = useState({ endereco: "", bairro: "", cidade: "" })
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "ok" | "notfound">("idle")
  const cepAbort = useRef<AbortController | null>(null)
  const [order, setOrder] = useState<string | null>(null)
  const successRef = useRef<HTMLHeadingElement>(null)

  // CEP completo → ViaCEP preenche rua, bairro, cidade e UF; o foco vai para "Número".
  async function fillFromCep(value: string) {
    cepAbort.current?.abort()
    if (value.replace(/\D/g, "").length !== 8) return setCepStatus("idle")
    const ctrl = new AbortController()
    cepAbort.current = ctrl
    setCepStatus("loading")
    try {
      const found = await lookupCep(value, ctrl.signal)
      if (ctrl.signal.aborted) return
      if (!found) return setCepStatus("notfound")
      setAddr((a) => ({
        endereco: found.endereco || a.endereco,
        bairro: found.bairro || a.bairro,
        cidade: found.cidade || a.cidade,
      }))
      setUf(found.uf)
      setErrors((e) => ({ ...e, endereco: found.endereco ? "" : e.endereco, bairro: found.bairro ? "" : e.bairro, cidade: "", uf: "" }))
      setCepStatus("ok")
      document.getElementById(found.endereco ? "numero" : "endereco")?.focus()
    } catch {
      // sem internet/serviço fora: segue manual, sem bloquear a compra
      if (!ctrl.signal.aborted) setCepStatus("notfound")
    }
  }

  if (order) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <Mascot pose="success" className="h-48 w-auto" />
        <h1 ref={successRef} tabIndex={-1} className="text-3xl font-bold md:text-4xl">
          Pedido recebido!
        </h1>
        <p className="text-lg">
          Número do pedido: <strong className="font-display text-blue">{order}</strong>
        </p>
        <p className="max-w-[45ch] text-muted">Vamos confirmar a entrega e o frete pelo WhatsApp.</p>
        <p className="rounded-card border-2 border-ink bg-lemon px-4 py-2 text-sm font-semibold">
          Isto é uma demonstração: nenhum pagamento foi feito.
        </p>
        <Button href="/">Voltar à loja</Button>
      </div>
    )
  }

  if (!hydrated) return <Skeleton className="h-96 w-full" />

  if (items.length === 0) {
    return (
      <EmptyState as="h1" title="Seu carrinho está vazio" text="Adicione produtos para finalizar a compra." action={<Button href="/ofertas">Ver ofertas</Button>} />
    )
  }

  const card = installments(totals.subtotalCents)
  const total = payment === "pix" ? totals.pixTotalCents : totals.subtotalCents
  const missing = Object.entries(errors).filter(([, msg]) => msg)

  const props = (name: string) => ({
    id: name,
    name,
    required: Boolean(FIELDS[name].required),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-erro` : undefined,
    onInput: tried ? (e: { currentTarget: HTMLInputElement | HTMLSelectElement }) => revalidate(e.currentTarget) : undefined,
  })

  // Enquanto digita, só APAGA o erro quando o campo fica válido. Erros novos só aparecem no envio:
  // validar no blur mexia no layout no mousedown do botão e o clique em "Confirmar" se perdia.
  function revalidate(el: HTMLInputElement | HTMLSelectElement) {
    if (!message(el)) setErrors((prev) => (prev[el.name] ? { ...prev, [el.name]: "" } : prev))
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fields = Array.from(form.elements).filter(
      (el): el is HTMLInputElement | HTMLSelectElement => (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) && el.name in FIELDS,
    )
    const next = Object.fromEntries(fields.map((el) => [el.name, message(el)]))
    setErrors(next)
    setTried(true)
    const firstInvalid = fields.find((el) => next[el.name])
    if (firstInvalid) {
      firstInvalid.focus()
      return
    }
    // Só tela: nenhum dado sai do navegador. O pagamento real entra no subprojeto 3.
    setOrder(orderNumber())
    clear()
    window.scrollTo({ top: 0 })
    requestAnimationFrame(() => successRef.current?.focus())
  }

  const onMasked = (format: (v: string) => string, set: (v: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    set(format(e.target.value))
    if (tried) revalidate(e.target)
  }

  const summary = (
    <>
      <ul className="flex flex-col gap-2 text-sm">
        {items.map((i) => (
          <li key={i.slug} className="flex justify-between gap-3">
            <span className="line-clamp-2">
              {i.qty}x {i.name}
            </span>
            {/* mesmo preço do carrinho: Pix por linha quando o Pix está escolhido */}
            <span className="shrink-0 tabular-nums">
              {formatBRL(payment === "pix" ? pixPrice(i.priceCents * i.qty) : i.priceCents * i.qty)}
            </span>
          </li>
        ))}
      </ul>
      <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 border-t border-ink/15 pt-3 text-sm">
        {/* As linhas acima já estão no preço da forma escolhida: subtotal = soma delas. */}
        <dt>Subtotal</dt>
        <dd className="text-right tabular-nums">{formatBRL(total)}</dd>
        {payment === "pix" && (
          <dd className="col-span-2 text-right text-xs text-muted">Você economiza {formatBRL(totals.pixDiscountCents)} no Pix</dd>
        )}
        <dt>Frete</dt>
        <dd className="text-right text-muted">a calcular</dd>
        <div className="col-span-2 mt-2 flex justify-between border-t-2 border-ink pt-3 font-display text-xl font-bold">
          <dt>Total</dt>
          <dd className="text-blue tabular-nums">{formatBRL(total)}</dd>
        </div>
        {payment === "cartao" && card.n > 1 && (
          <dd className="col-span-2 text-right text-xs text-muted">
            em até {card.n}x de {formatBRL(card.valueCents)} sem juros
          </dd>
        )}
      </dl>
    </>
  )

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_360px] md:items-start md:gap-10">
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold md:text-4xl">Finalizar compra</h1>

        {/* No celular o total fica à vista desde o início (no desktop há o resumo fixo à direita). */}
        <details className="-mt-4 rounded-card border-2 border-ink bg-white p-4 md:hidden">
          <summary className="cursor-pointer font-semibold">
            {totals.count} {totals.count === 1 ? "item" : "itens"} · total {formatBRL(total)} <span className="font-normal text-blue">ver resumo</span>
          </summary>
          <div className="mt-4 flex flex-col gap-3">{summary}</div>
        </details>

        {/* Resumo de erros: anunciado ao enviar, com atalho para cada campo. */}
        <div role="alert" className="empty:hidden">
          {missing.length > 0 && (
            <div className="flex gap-3 rounded-card border-2 border-dashed border-ink bg-white p-4">
              <Mascot pose="avatar" className="size-12 shrink-0 rounded-full" />
              <div>
                <p className="font-display text-lg font-bold">
                  {missing.length === 1 ? "Falta 1 informação" : `Faltam ${missing.length} informações`} para confirmar
                </p>
                <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                  {missing.map(([name]) => (
                    <li key={name}>
                      <a
                        href={`#${name}`}
                        onClick={(e) => {
                          e.preventDefault()
                          document.getElementById(name)?.focus()
                        }}
                        className="inline-block py-1 font-semibold underline underline-offset-4"
                      >
                        {FIELDS[name].label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 font-display text-xl font-bold">1. Seus dados</legend>
          <Field def={FIELDS.nome} error={errors.nome}>
            <input {...props("nome")} autoComplete="name" className={inputCls} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field def={FIELDS.email} error={errors.email}>
              <input {...props("email")} type="email" autoComplete="email" inputMode="email" className={inputCls} />
            </Field>
            <Field def={FIELDS.celular} error={errors.celular}>
              <input
                {...props("celular")}
                type="tel"
                autoComplete="tel-national"
                inputMode="numeric"
                pattern="\(\d{2}\) \d{4,5}-\d{4}"
                value={phone}
                onChange={onMasked(formatPhone, setPhone)}
                className={inputCls}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 font-display text-xl font-bold">2. Entrega</legend>
          <Field def={FIELDS.cep} error={errors.cep} className="sm:max-w-48">
            <input
              {...props("cep")}
              autoComplete="postal-code"
              inputMode="numeric"
              pattern="\d{5}-\d{3}"
              value={cep}
              onChange={(e) => {
                onMasked(formatCep, setCep)(e)
                fillFromCep(formatCep(e.target.value))
              }}
              aria-describedby={errors.cep ? "cep-erro" : "cep-status"}
              className={inputCls}
            />
            <p id="cep-status" aria-live="polite" className="text-sm text-muted empty:hidden">
              {cepStatus === "loading" && "Buscando endereço…"}
              {cepStatus === "ok" && "Endereço preenchido pelo CEP. Confira e informe o número."}
              {cepStatus === "notfound" && "Não achamos esse CEP. Preencha o endereço abaixo."}
            </p>
          </Field>
          <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
            <Field def={FIELDS.endereco} error={errors.endereco}>
              <input {...props("endereco")} autoComplete="address-line1" value={addr.endereco} onChange={(e) => setAddr({ ...addr, endereco: e.target.value })} className={inputCls} />
            </Field>
            <Field def={FIELDS.numero} error={errors.numero}>
              <input {...props("numero")} autoComplete="off" className={inputCls} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field def={FIELDS.complemento}>
              <input {...props("complemento")} autoComplete="address-line2" className={inputCls} />
            </Field>
            <Field def={FIELDS.bairro} error={errors.bairro}>
              <input {...props("bairro")} autoComplete="address-level3" value={addr.bairro} onChange={(e) => setAddr({ ...addr, bairro: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
            <Field def={FIELDS.cidade} error={errors.cidade}>
              <input {...props("cidade")} autoComplete="address-level2" value={addr.cidade} onChange={(e) => setAddr({ ...addr, cidade: e.target.value })} className={inputCls} />
            </Field>
            <Field def={FIELDS.uf} error={errors.uf}>
              {/* controlado: um <select> não controlado voltava para vazio quando o form re-renderizava */}
              <select
                {...props("uf")}
                autoComplete="address-level1"
                value={uf}
                onChange={(e) => {
                  setUf(e.target.value)
                  if (tried) revalidate(e.target)
                }}
                className={inputCls}
              >
                <option value="" disabled>
                  UF
                </option>
                {UFS.map((uf) => (
                  <option key={uf}>{uf}</option>
                ))}
              </select>
            </Field>
          </div>
          <p className="text-sm text-muted">Frete: a calcular.</p>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 font-display text-xl font-bold">3. Como prefere pagar?</legend>
          <div className="mb-2 flex items-center gap-3 rounded-card bg-tint-sky p-4">
            <Mascot pose="avatar" className="size-12 shrink-0 rounded-full" />
            <p className="text-sm">
              <strong className="font-semibold">Você escolhe agora e paga depois.</strong> Primeiro confirmamos o frete e o prazo pelo
              WhatsApp; só então combinamos o pagamento.
            </p>
          </div>
          <PayOption value="pix" checked={payment === "pix"} onSelect={setPayment} icon={<QrCode aria-hidden className="size-6" />}>
            <span className="flex flex-wrap items-center gap-2 font-semibold">
              Pix <Badge kind="pix">{Math.round(PIX_DISCOUNT * 100)}% off</Badge>
            </span>
            <span className="text-sm text-muted">Total com desconto: {formatBRL(totals.pixTotalCents)}</span>
          </PayOption>
          <PayOption value="cartao" checked={payment === "cartao"} onSelect={setPayment} icon={<CreditCard aria-hidden className="size-6" />}>
            <span className="font-semibold">Cartão de crédito</span>
            <span className="text-sm text-muted">
              {card.n > 1 ? `Até ${card.n}x de ${formatBRL(card.valueCents)} sem juros` : `${formatBRL(totals.subtotalCents)} à vista`}
            </span>
          </PayOption>
        </fieldset>

        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-full md:w-auto md:self-start">
            Confirmar pedido · {formatBRL(total)}
          </Button>
          <p className="text-xs text-muted">Demonstração: nenhum pedido é enviado. Só o CEP é consultado no ViaCEP para preencher o endereço.</p>
        </div>
      </form>

      <aside aria-label="Resumo do pedido" className="hidden flex-col gap-4 rounded-card border-2 border-ink bg-white p-5 shadow-brut md:sticky md:top-32 md:flex">
        <h2 className="text-xl font-bold">Resumo do pedido</h2>
        {summary}
      </aside>
    </div>
  )
}

function PayOption({
  value,
  checked,
  onSelect,
  icon,
  children,
}: {
  value: "pix" | "cartao"
  checked: boolean
  onSelect: (v: "pix" | "cartao") => void
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-4 rounded-card border-2 border-ink p-4 transition-[background-color,box-shadow] duration-150 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue ${
        checked ? "bg-tint-sky shadow-brut-sm" : "bg-white"
      }`}
    >
      <input type="radio" name="pagamento" value={value} checked={checked} onChange={() => onSelect(value)} className="size-5 accent-blue" />
      {icon}
      <span className="flex flex-col">{children}</span>
    </label>
  )
}
