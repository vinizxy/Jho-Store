# Jho Utilidades Vitrine v1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vitrine front-end navegável da Jho Utilidades (home → produto → carrinho → checkout de tela) com catálogo mock trocável.

**Architecture:** Next.js App Router com Server Components por padrão. O catálogo fica atrás da interface `CatalogRepository` (mock JSON). O carrinho é um reducer puro + Context persistido em localStorage. Filtros e ordenação vivem na URL. Tokens visuais em um único CSS `@theme`.

**Tech Stack:** Next 16.4, React 19.3, TypeScript strict, Tailwind 4.3, lucide-react, Vitest 5, Playwright 1.64.

**Spec:** `docs/superpowers/specs/2026-10-11-jho-utilidades-vitrine-design.md`. Leia a spec inteira antes de começar; as seções citadas abaixo (§N) são dela.

## Global Constraints

- Textos da UI em PT-BR simples e curtos. Código e nomes em inglês. Commits em PT (`feat:`, `fix:`, `test:`, `docs:`).
- Valores monetários são **centavos inteiros**. Formatação só via `formatBRL`.
- Valores de negócio só em `lib/config.ts` (§3). Cores, bordas, sombras, raios e fontes só em `styles/tokens.css` (§4). Nenhum hex fora desse arquivo.
- Sem vermelho, gradiente, blur, parallax ou carrossel automático. Motion de 120–200ms, desligado com `prefers-reduced-motion`.
- Única dependência de runtime além de next/react: `lucide-react`. Dev: vitest, @playwright/test.
- Alvos de toque ≥ 44px, foco visível (outline 3px azul, offset 2px), `lang="pt-BR"`.
- Uma ação primária por tela. Componentes `"use client"` só nos listados em §6.
- Cada task termina com `npm run typecheck && npm run lint && npm test` verdes antes do commit.

## Review Focus

1. **localStorage corrompido ou bloqueado** (JSON inválido, item sem `slug`, qty negativa, modo privado lançando exceção) → carrinho vazio ou só os itens válidos, nunca crash. Pin: Task 3 `parseCart`.
2. **Parâmetros de URL inválidos** (`?f=xyz&ordem=abc`, valores repetidos em array) → caem no padrão (sem filtro, relevância). Pin: Task 2 `parseListParams`.
3. **Busca com caracteres especiais ou vazia** (`"c++"`, `"("`, `"   "`) → não lança erro. Vazia → `[]` (a página mostra sugestões). Pin: Task 2 `searchProducts`.
4. **Produto barato** (R$ 9,90) → "1x de R$ 9,90", nunca "6x de R$ 1,65". Pin: Task 1 `installments`.
5. **Quantidade fora do limite** (setQty 0, -1, 999, NaN) → 0/negativo/NaN remove, acima de 10 limita a 10. Pin: Task 3 reducer.

---

### Task 1: Scaffold, tokens, config e regras de preço

**Files:**
- Create (via CLI): projeto Next na raiz do repo (já contém `docs/` e `.git`)
- Create: `lib/config.ts`, `lib/cart/pricing.ts`, `styles/tokens.css`, `vitest.config.ts`, `playwright.config.ts`, `.env.example`, `README.md`, `CLAUDE.md`
- Modify: `app/globals.css` (importa tokens), `app/layout.tsx` (fontes, `lang`), `package.json` (scripts)
- Test: `tests/unit/pricing.test.ts`

**Interfaces:**
- Produces: `BRAND, PIX_DISCOUNT, MAX_INSTALLMENTS, MIN_INSTALLMENT_CENTS, MAX_QTY_PER_ITEM, WHATSAPP, SITE_URL` (§3). `pixPrice(cents: number): number`, `installments(cents: number): { n: number; valueCents: number }`, `discountPercent(priceCents: number, compareAtCents: number): number`, `formatBRL(cents: number): string`, `whatsappUrl(text?: string): string | null`. Classes Tailwind geradas pelos tokens: `bg-cream`, `text-ink`, `bg-blue`, `bg-sky`, `bg-lemon`, `text-muted`, `shadow-brut`, `shadow-brut-sm`, `font-display`, `font-sans`, `rounded-card`.
- Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `e2e` (`playwright test`).

- [ ] **Step 1: Scaffold**

Run: `npx create-next-app@16.4.0 . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes`, depois `npm i lucide-react` e `npm i -D vitest @playwright/test`, depois `npx playwright install chromium`.
Expected: `npm run dev` serve a página padrão em :3000.

- [ ] **Step 2: Tokens e fontes**

`styles/tokens.css` com `@theme` contendo os valores exatos de §4 (cores, `--shadow-brut: 4px 4px 0 var(--color-ink)`, `--shadow-brut-sm: 2px 2px 0 var(--color-ink)`, `--radius-card: 12px`, os 4 tints). Em `@media (prefers-reduced-motion: reduce)` zere `transition` e `transform` de `*`. `globals.css`: `@import "tailwindcss"; @import "../styles/tokens.css";`, body `bg-cream text-ink font-sans`, `:focus-visible { outline: 3px solid var(--color-blue); outline-offset: 2px }`. `layout.tsx`: `Bricolage_Grotesque` → `--font-display`, `Inter` → `--font-sans`, `<html lang="pt-BR">`. Apague o conteúdo demo de `app/page.tsx` e `public/*.svg`.

- [ ] **Step 3: Write the failing tests** (`tests/unit/pricing.test.ts`)

```ts
expect(pixPrice(9900)).toBe(9405)
expect(pixPrice(999)).toBe(949)                         // round(949.05)
expect(installments(9900)).toEqual({ n: 6, valueCents: 1650 })
expect(installments(990)).toEqual({ n: 1, valueCents: 990 })   // Review Focus 4
expect(installments(2500)).toEqual({ n: 2, valueCents: 1250 }) // floor(2500/1000)=2
expect(installments(1001)).toEqual({ n: 1, valueCents: 1001 })
expect(installments(5999)).toEqual({ n: 5, valueCents: 1200 }) // ceil(1199.8)
expect(discountPercent(7990, 9990)).toBe(20)
expect(formatBRL(9405).replace(/\s/g, " ")).toBe("R$ 94,05") // Intl usa NBSP
```

- [ ] **Step 4: Run** `npm test` → FAIL (module not found)

- [ ] **Step 5: Implement** `lib/config.ts` (exatamente §3) e `lib/cart/pricing.ts` (fórmulas de §5). O `Intl.NumberFormat` fica em uma constante de módulo. `whatsappUrl` retorna `null` se `WHATSAPP` for vazio; senão, `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`.

- [ ] **Step 6: Run** `npm test` → PASS. `npm run typecheck && npm run lint` → sem erros.

- [ ] **Step 7: Docs do repo**

`.env.example` (§3). `README.md`: requisitos (Node 24), `npm i`, `cp .env.example .env.local`, `npm run dev`, `npm test`, `npm run e2e`, onde trocar marca/desconto/parcelas (`lib/config.ts`), cores (`styles/tokens.css`), catálogo (`lib/catalog/index.ts`), mascote (`public/mascote-*.svg`). `CLAUDE.md`: resumo do brief (objetivo, Princípio nº 1, direção visual, stack, YAGNI), link para spec e plano, seção "Decisões" com: gaveta = `<dialog>`; filtros na URL; categorias mobile = página `/categorias`; chips = Todos/Oferta/Até 50/Até 100 (Pix); parcela mínima R$ 10; card sem botão "+" (3 cliques); "Mais vendidos" só como ordenação. Regra: atualizar o CLAUDE.md a cada decisão nova.

- [ ] **Step 8: Commit** `feat: scaffold Next 16 com tokens, config e regras de preço`

---

### Task 2: Catálogo mock + busca + parâmetros de lista

**Files:**
- Create: `lib/catalog/types.ts`, `lib/catalog/repository.ts`, `lib/catalog/data.json`, `lib/catalog/search.ts`, `lib/catalog/params.ts`, `lib/catalog/mock.ts`, `lib/catalog/index.ts`
- Test: `tests/unit/catalog.test.ts`

**Interfaces:**
- Produces: tipos `Category`, `Product`, `Tint = "sky" | "lemon" | "blue50" | "creamDark"`, `IconName` (string do nome lucide, ex. `"Sofa"`), `Filter = "oferta" | "ate-50" | "ate-100"`, `Sort = "relevancia" | "menor-preco" | "maior-preco" | "mais-vendidos"`, `ListQuery = { category?: string; q?: string; filter?: Filter; sort?: Sort }`.
- `interface CatalogRepository` com métodos `async` (§6): `listCategories(): Promise<Category[]>`, `getCategory(slug): Promise<Category | null>`, `listProducts(query: ListQuery): Promise<Product[]>`, `getProduct(slug): Promise<Product | null>`, `getRelated(product: Product, n: number): Promise<Product[]>`, `getDeals(n): Promise<Product[]>`, `getBestSellers(n): Promise<Product[]>`.
- `normalize(s: string): string`, `searchProducts(products: Product[], categories: Category[], q: string): Product[]`.
- `parseListParams(sp: Record<string, string | string[] | undefined>): { filter?: Filter; sort: Sort }`, que lê as chaves `f` e `ordem`.
- `catalog: CatalogRepository` exportado de `lib/catalog/index.ts`.

- [ ] **Step 1: data.json**

8 categorias (§5) com ícone lucide (`Sofa`, `CookingPot`, `Wrench`, `Headphones`, `Sparkles`, `Puzzle`, `PawPrint`, `Boxes`) e tints alternados. 5 produtos por categoria: nomes realistas em PT, `priceCents` entre 1990 e 39990, pelo menos 1 produto abaixo de 1000 centavos no total, ~10 com `compareAtCents`, ~8 com `badge`, `soldCount` variado, `images: []`, 2–4 `specs`, descrição de 2–3 frases. Slugs em kebab-case sem acento.

- [ ] **Step 2: Write the failing tests**

```ts
// search
expect(normalize("Eletrônicos  ")).toBe("eletronicos")
expect(searchProducts(P, C, "panela").every(p => normalize(p.name).includes("panela"))).toBe(true)
expect(searchProducts(P, C, "eletronico").length).toBeGreaterThan(0)     // casa nome da categoria
expect(searchProducts(P, C, "panela antiaderente").length)               // todos os termos (AND)
  .toBeLessThanOrEqual(searchProducts(P, C, "panela").length)
expect(() => searchProducts(P, C, "c++ (")).not.toThrow()               // Review Focus 3
expect(searchProducts(P, C, "   ")).toEqual([])
// params — Review Focus 2
expect(parseListParams({ f: "oferta", ordem: "menor-preco" })).toEqual({ filter: "oferta", sort: "menor-preco" })
expect(parseListParams({ f: "xyz", ordem: ["abc", "menor-preco"] })).toEqual({ filter: undefined, sort: "relevancia" })
// repo
const deals = await catalog.getDeals(4)
expect(deals.every(p => p.compareAtCents)).toBe(true)
const cheap = await catalog.listProducts({ filter: "ate-50" })
expect(cheap.every(p => pixPrice(p.priceCents) <= 5000)).toBe(true)
const asc = await catalog.listProducts({ category: "cozinha", sort: "menor-preco" })
expect(asc.map(p => p.priceCents)).toEqual([...asc.map(p => p.priceCents)].sort((a, b) => a - b))
expect(await catalog.getProduct("nao-existe")).toBeNull()
const p = (await catalog.listProducts({}))[0]
const rel = await catalog.getRelated(p, 4)
expect(rel).toHaveLength(4); expect(rel.some(r => r.slug === p.slug)).toBe(false)
```

- [ ] **Step 3: Run** `npm test` → FAIL

- [ ] **Step 4: Implement**

`normalize`: `toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim()`. Busca: tokens de `q` separados por espaço; um produto casa se cada token está em `normalize(name + " " + categoryName + " " + description)`. Use só `includes`, nunca RegExp com o input. Relevância na busca: produtos com match no nome vêm primeiro. Na categoria, vale a ordem do JSON. `getDeals`: com `compareAtCents`, ordenado por `discountPercent` desc. `getBestSellers`: por `soldCount` desc. `getRelated`: mesma categoria, excluindo o próprio, completando com mais vendidos se faltar. `parseListParams`: aceita só valores dos unions; array → ignora.

- [ ] **Step 5: Run** `npm test` → PASS

- [ ] **Step 6: Commit** `feat: catálogo mock com repositório, busca e filtros`

---

### Task 3: Carrinho (reducer, storage, provider)

**Files:**
- Create: `lib/cart/types.ts`, `lib/cart/reducer.ts`, `lib/cart/storage.ts`, `lib/cart/CartProvider.tsx`
- Test: `tests/unit/cart.test.ts`

**Interfaces:**
- Consumes: `MAX_QTY_PER_ITEM`, `pixPrice` (Task 1); `Product` (Task 2).
- Produces: `CartItem = { slug: string; name: string; priceCents: number; categorySlug: string; qty: number }`. `CartAction = { type: "add"; item: Omit<CartItem, "qty">; qty?: number } | { type: "remove"; slug } | { type: "setQty"; slug; qty: number } | { type: "clear" } | { type: "hydrate"; items: CartItem[] }`. `cartReducer(state: CartItem[], action: CartAction): CartItem[]`. `cartTotals(items): { count: number; subtotalCents: number; pixDiscountCents: number; pixTotalCents: number }`. `CART_KEY = "jho-cart-v1"`, `parseCart(raw: string | null): CartItem[]`.
- `CartProvider` (client) + `useCart(): { items, totals, hydrated: boolean, add(product: Product, qty?: number), remove(slug), setQty(slug, qty), clear(), drawerOpen: boolean, openDrawer(), closeDrawer() }`. `add` também chama `openDrawer()`.

- [ ] **Step 1: Write the failing tests**

```ts
const it1 = { slug: "a", name: "A", priceCents: 1000, categorySlug: "casa" }
let s = cartReducer([], { type: "add", item: it1 })
s = cartReducer(s, { type: "add", item: it1, qty: 2 })
expect(s).toEqual([{ ...it1, qty: 3 }])
expect(cartReducer(s, { type: "add", item: it1, qty: 50 })[0].qty).toBe(10)   // Review Focus 5
expect(cartReducer(s, { type: "setQty", slug: "a", qty: 999 })[0].qty).toBe(10)
for (const q of [0, -1, NaN]) expect(cartReducer(s, { type: "setQty", slug: "a", qty: q })).toEqual([])
expect(cartReducer(s, { type: "remove", slug: "a" })).toEqual([])
expect(cartTotals([{ ...it1, qty: 3 }, { ...it1, slug: "b", priceCents: 999, qty: 1 }]))
  .toEqual({ count: 4, subtotalCents: 3999, pixDiscountCents: 200, pixTotalCents: 3799 })
// storage — Review Focus 1
expect(parseCart(null)).toEqual([])
expect(parseCart("{oops")).toEqual([])
expect(parseCart(JSON.stringify([{ ...it1, qty: 2 }, { name: "sem slug", qty: 1 }, { ...it1, slug: "c", qty: -3 }])))
  .toEqual([{ ...it1, qty: 2 }])
```

(`pixDiscountCents = subtotal - pixPrice(subtotal)`: 3999 − 3799 = 200.)

- [ ] **Step 2: Run** `npm test` → FAIL

- [ ] **Step 3: Implement** reducer, `cartTotals`, `parseCart` (valida cada campo por tipo; qty inteira de 1 a 10, senão descarta) e `CartProvider`: `useReducer`. Hidrata em `useEffect` com `localStorage.getItem` em try/catch e marca `hydrated=true`. Persiste a cada mudança após a hidratação (try/catch). O estado da gaveta também mora aqui.

- [ ] **Step 4: Run** `npm test` → PASS

- [ ] **Step 5: Commit** `feat: carrinho com reducer puro e persistência local`

---

### Task 4: Átomos de UI e mascote placeholder

**Files:**
- Create: `components/ui/Button.tsx`, `Badge.tsx`, `Chip.tsx`, `Price.tsx`, `Skeleton.tsx`, `Mascot.tsx`, `Icon.tsx`, `public/mascote-hero.svg`, `public/mascote-empty.svg`, `public/mascote-404.svg`, `public/mascote-avatar.svg`
- Create: `app/dev/ui/page.tsx` (vitrine dos átomos, só em dev: `notFound()` se `NODE_ENV === "production"`)

**Interfaces:**
- `Button({ variant?: "primary" | "secondary" | "ghost"; href?: string; ...ButtonHTMLAttributes })`: renderiza `<Link>` se houver `href`. Primary: `bg-blue text-white border-2 border-ink shadow-brut rounded-card min-h-12 px-5 font-display font-bold`, e no hover/active fica `shadow-brut-sm translate-x-0.5 translate-y-0.5` com `transition 150ms`.
- `Badge({ kind: "oferta" | "mais-vendido" | "novo" | "pix"; children? })`: oferta/pix = `bg-lemon`, mais-vendido = `bg-sky`, novo = `bg-white`. Todos com borda 2px. Rótulos padrão: "Oferta", "Mais vendido", "Novo".
- `Chip({ href: string; active: boolean; children })`: `<Link>` com `aria-current={active ? "page" : undefined}`, ativo = `bg-sky shadow-brut-sm`, `min-h-11`.
- `Price({ cents: number; compareAtCents?: number; size?: "sm" | "lg" })`: linha 1 `formatBRL(pixPrice(cents))` + " no Pix" (azul, display, bold). Linha 2 opcional "de R$ X" riscado (`<s>`, text-muted). Linha 3 `ou ${formatBRL(cents)} em até ${n}x de ${formatBRL(valueCents)} sem juros` (quando `n === 1`: `ou ${formatBRL(cents)} no cartão`).
- `Skeleton({ className })`: bloco `bg-white/60 animate-pulse rounded-card`.
- `Mascot({ pose: "hero" | "empty" | "404" | "avatar"; className? })`: `next/image` de `/mascote-${pose}.svg` com alt "Mascote da Jho Utilidades".
- `Icon({ name: IconName; className? })`: mapa explícito nome → componente lucide, só dos ícones usados (sem `import *`).

- [ ] **Step 1: SVGs do mascote**: ilustração simples e plana (cabeça com cachos loiros `#F2C14E`, camiseta azul `#2C5AA0`, bermuda `#1A1A1F`, sacola creme, contorno 2px ink). As poses variam braço/expressão. Precisam parecer intencionais, não caixas cinza.
- [ ] **Step 2: Implement** os átomos acima, aplicando a skill frontend-design/design-taste-frontend para os detalhes (§4: contenção).
- [ ] **Step 3: Verify** `npm run dev` → `/dev/ui` mostra todos os átomos. Tab percorre os focáveis com outline visível. `npm run typecheck && npm run lint` ok.
- [ ] **Step 4: Commit** `feat: átomos de UI neo-brutalistas e mascote placeholder`

---

### Task 5: Shell do site (header, navegação, gaveta, rodapé)

**Files:**
- Create: `components/shop/SearchBar.tsx`, `CategoryNav.tsx`, `BottomNav.tsx`, `CartButton.tsx`, `CartDrawer.tsx`, `CartLine.tsx`, `CartSummary.tsx`, `EmptyState.tsx`, `Header.tsx`, `Footer.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `useCart` (Task 3), `catalog.listCategories` (Task 2), átomos (Task 4), `whatsappUrl`, `BRAND`.
- Produces: `CartLine({ item: CartItem })` (−/qty/+ com `aria-label` "Diminuir quantidade de {name}" e "Aumentar quantidade de {name}", e o botão "Remover"). `CartSummary({ compact?: boolean })` (subtotal, desconto Pix, total no Pix, parcelado). `EmptyState({ title: string; text?: string; action?: ReactNode; pose?: "empty" | "404" })`. Esses três são reutilizados nas Tasks 7 e 8.

- [ ] **Step 1: Implement** conforme §7:
  - Layout: skip link → `#conteudo`, `Header` (sticky, `bg-white border-b-2 border-ink`), `CategoryNav` (só `lg:`), `<main id="conteudo">`, `Footer`, `BottomNav` (só `< md`, `fixed bottom-0`, `pb-[env(safe-area-inset-bottom)]`; o main recebe `pb-20 md:pb-0`), `CartDrawer`. Tudo dentro de `CartProvider`.
  - `SearchBar`: `<form action="/busca" role="search">` com `<input type="search" name="q" aria-label="Buscar produtos">` + botão com ícone e `aria-label="Buscar"`. Prop `autoFocus?` e `defaultValue?`.
  - `CartButton` (client): mostra o contador só se `hydrated && count > 0`, com `aria-label` "Carrinho, N itens". Abre a gaveta.
  - `BottomNav`: 4 links com ícone + rótulo; ativo via `usePathname` com `aria-current="page"`.
  - `CartDrawer` (client): `<dialog>` com `showModal()` quando `drawerOpen` for true. Fecha via `close`, Esc e clique no backdrop (`e.target === dialog`). Tem `aria-labelledby` no título "Seu carrinho" e região `aria-live="polite"` com "Adicionado ao carrinho" após `add`. Rodapé com `CartSummary compact`, Button primary "Finalizar compra" → `/checkout` e Button ghost "Continuar comprando". Vazio → `EmptyState`. Animação de slide-in de 180ms (desligada em reduced-motion).
  - `Footer`: categorias, link do WhatsApp (só se `whatsappUrl()` existir), "© {ano} {BRAND.name}" e o aviso "Protótipo: pagamento ainda não está ativo."
- [ ] **Step 2: Verify** no navegador em 375 e 1280: o header mostra a busca nas duas larguras, a bottom nav só aparece no mobile e a faixa de categorias só no desktop. Esc fecha a gaveta e o foco volta ao botão.
- [ ] **Step 3: Commit** `feat: header, navegação, gaveta do carrinho e rodapé`

---

### Task 6: Cards e Home

**Files:**
- Create: `components/shop/ProductImage.tsx`, `ProductCard.tsx`, `ProductGrid.tsx`, `TrustBadges.tsx`, `CategoryGrid.tsx`, `Section.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- `ProductImage({ product: Product; category: Category; sizes: string; priority?: boolean })` (§9).
- `ProductCard({ product; category })`: o card inteiro é `<Link href={/p/slug}>`, com `<h3>` do nome `line-clamp-2` e `Price size="sm"`. Badge no canto. Mostra o badge "-X%" se houver `compareAtCents`.
- `ProductGrid({ products; categories })`: `ul` em `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`.
- `CategoryGrid({ categories; variant: "strip" | "grid" })`: strip = rolagem horizontal com `snap-x`. Grid = 2/4 colunas, ícones grandes (48px), alvos ≥ 96px.
- `Section({ title; href?; children })`: `<section aria-labelledby>` + h2 + link discreto "Ver tudo".

- [ ] **Step 1: Implement** a home (§8): hero com `h1` "Tudo pra sua casa e muito mais" + subtítulo "Preço baixo, 5% off no Pix e entrega pra todo o Brasil." + CTA "Ver ofertas" → âncora `#ofertas` + `Mascot pose="hero"` (com `priority`). Depois `CategoryGrid strip`, `Section "Ofertas do dia" id="ofertas"` (getDeals 8, sem href), `Section "Mais vendidos"` (getBestSellers 8, sem href) e `TrustBadges` (3 selos: "5% off no Pix" com Badge pix, "Entrega pra todo o Brasil", "Troca fácil em até 7 dias"). Metadata da home com descrição.
- [ ] **Step 2: Verify** `/` em 375/768/1280: nenhuma rolagem horizontal da página (só o strip), as imagens placeholder têm cor + ícone + nome e o hover do card afunda.
- [ ] **Step 3: Commit** `feat: home com hero, categorias, ofertas e mais vendidos`

---

### Task 7: Categoria, Categorias e Busca

**Files:**
- Create: `app/c/[slug]/page.tsx`, `app/c/[slug]/loading.tsx`, `app/categorias/page.tsx`, `app/busca/page.tsx`, `app/busca/loading.tsx`, `components/shop/Breadcrumbs.tsx`, `components/shop/FilterChips.tsx`, `components/shop/SortSelect.tsx`, `components/shop/GridSkeleton.tsx`, `components/shop/JsonLd.tsx`

**Interfaces:**
- Consumes: `parseListParams`, `catalog.*`, `ProductGrid`, `EmptyState`, `CategoryGrid`.
- `Breadcrumbs({ items: { name: string; href?: string }[] })`: `<nav aria-label="Você está em">` + `<ol>`. O último item não é link e leva `aria-current="page"`.
- `FilterChips({ basePath: string; params: Record<string,string>; active?: Filter })`: chips Todos/Em oferta/Até R$ 50/Até R$ 100. Cada href preserva os outros params (`q`, `ordem`).
- `SortSelect({ value: Sort })` (client): `<label>Ordenar</label><select>`. No `onChange`, faz `router.push` com `ordem` atualizado, preservando os demais params.
- `JsonLd({ data: object })`: `<script type="application/ld+json">` com `JSON.stringify(data).replace(/</g, "\\u003c")`.

- [ ] **Step 1: Implement** a categoria (§8): `generateStaticParams` com todos os slugs. Slug inválido → `notFound()`. `generateMetadata` com título = nome da categoria. Breadcrumbs Início › Categoria + JSON-LD BreadcrumbList. h1 + "N produtos". Chips + Sort. Filtro sem itens → `EmptyState` "Nenhum produto com esse filtro" + Chip "Ver todos".
- [ ] **Step 2: Implement** `/categorias`: h1 "Categorias" + `CategoryGrid grid`.
- [ ] **Step 3: Implement** a busca: `SearchBar autoFocus defaultValue={q}`. Sem `q`: categorias + mais vendidos. Com resultados: "N resultados para 'q'" + chips + sort + grade. Sem resultados: `EmptyState` com o título "Não achamos “{q}”", o texto "Tente outra palavra ou veja as categorias.", depois strip de categorias + Mais vendidos. Metadata `robots: { index: false }`.
- [ ] **Step 4: loading.tsx** com `GridSkeleton` (8 cards na forma do ProductCard).
- [ ] **Step 5: Verify** `/c/cozinha?f=oferta&ordem=menor-preco`: chip ativo e ordenação aplicada. `/c/xyz` → 404. `/busca?q=eletronico` acha resultados. `/busca?q=zzzz` mostra sugestões. Os chips funcionam com JS desligado.
- [ ] **Step 6: Commit** `feat: páginas de categoria, categorias e busca com filtros`

---

### Task 8: Produto

**Files:**
- Create: `app/p/[slug]/page.tsx`, `app/p/[slug]/loading.tsx`, `components/shop/ProductGallery.tsx`, `components/shop/AddToCart.tsx`, `components/shop/BuyBar.tsx`, `components/shop/QtyStepper.tsx`

**Interfaces:**
- `QtyStepper({ value; onChange; label: string })`: −/valor/+ com limites 1..10, botões 44px, `aria-label` com o nome do produto. Reaproveitado pela `CartLine` (refatore a Task 5 para usá-lo).
- `AddToCart({ product })` (client): QtyStepper + Button primary "Adicionar ao carrinho" → `add(product, qty)`.
- `BuyBar({ product })` (client): `fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] md:hidden` (4rem = altura da BottomNav), com preço Pix + botão "Adicionar" (qty 1). A página ganha padding-bottom extra no mobile.
- `ProductGallery({ product; category })`: com ≤ 1 imagem é server (só `ProductImage priority`). Com > 1, é client com miniaturas `<button aria-pressed>`.

- [ ] **Step 1: Implement** a página (§8): `generateStaticParams`. Slug inválido → `notFound()`. `generateMetadata` (title = nome, description = 155 primeiros caracteres da descrição, `openGraph.type = "website"`). Layout em 2 colunas `md:` (galeria | info). Info: Badge, h1, `Price size="lg" compareAtCents`, "Frete calculado no checkout", AddToCart, link ghost "Dúvidas? Fale no WhatsApp" (`whatsappUrl("Olá! Tenho interesse em: " + name)`, só se não for null). Abaixo: "Sobre o produto" (descrição), "Detalhes" (`<dl>` das specs), `Section "Você também pode gostar"` (getRelated 4). JSON-LD: Product (`name`, `description`, `sku: id`, `category`, `brand: { "@type": "Brand", name: BRAND.name }`) com `offers: { "@type": "Offer", price: (priceCents/100).toFixed(2), priceCurrency: "BRL", availability: "https://schema.org/InStock", url }` + BreadcrumbList (Início › Categoria › Produto).
- [ ] **Step 2: Verify** `/p/<slug>`: clicar em Adicionar abre a gaveta com o item e o leitor de tela anuncia "Adicionado ao carrinho". No mobile 375, a BuyBar fica visível acima da BottomNav sem cobrir conteúdo. O JSON-LD valida (copiar para o validator.schema.org manualmente é opcional).
- [ ] **Step 3: Commit** `feat: página de produto com compra, relacionados e Schema.org`

---

### Task 9: Carrinho em página e Checkout

**Files:**
- Create: `app/carrinho/page.tsx`, `app/checkout/page.tsx`, `components/shop/CheckoutForm.tsx`, `components/shop/OrderSuccess.tsx`, `lib/checkout.ts`
- Test: `tests/unit/checkout.test.ts`

**Interfaces:**
- `lib/checkout.ts`: `orderNumber(rand?: () => number): string` → `"JHO-"` + 6 caracteres de `"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"` (sem 0/O/1/I), índice `Math.floor(rand() * 32)`. `formatCep(v: string): string` → `"01310-100"` a partir de qualquer entrada, mantendo só dígitos (máx. 8). `UFS: readonly string[]` (27 siglas).
- `CheckoutForm` (client): consome `useCart`. Estado `submitted: string | null` (número do pedido).

- [ ] **Step 1: Failing tests**

```ts
expect(orderNumber(() => 0)).toBe("JHO-AAAAAA")
expect(orderNumber()).toMatch(/^JHO-[A-Z0-9]{6}$/)
expect(formatCep("01310100")).toBe("01310-100")
expect(formatCep("0131-0100abc99")).toBe("01310-100")
expect(formatCep("013")).toBe("013")
expect(UFS).toHaveLength(27)
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** `lib/checkout.ts`. **Step 4: Run** → PASS.
- [ ] **Step 5: Implement** `/carrinho` (client wrapper): h1 "Seu carrinho", lista de `CartLine`, `CartSummary`, Button primary "Finalizar compra". Vazio → `EmptyState` + "Ver ofertas" (`/#ofertas`). Antes de `hydrated`, mostra Skeleton.
- [ ] **Step 6: Implement** `/checkout` (§8): metadata `robots noindex`. Form em 3 `<fieldset>` com `<legend>` (Seus dados, Entrega, Pagamento) + resumo (`md:` coluna direita sticky; mobile: `<details>` "Ver resumo (N itens)" acima do botão). Campos com `autoComplete` corretos (`name`, `email`, `tel`, `postal-code`, `address-line1`, `address-level2`, `address-level1`), `inputMode="numeric"` em CEP/número/celular, CEP com `pattern="\d{5}-\d{3}"` + `formatCep` no onChange. Mensagens de erro em PT via `setCustomValidity` + `<p id aria-describedby>`, mostradas após o primeiro submit (`noValidate` + `form.checkValidity()` + foco no primeiro inválido). Pagamento: radios estilizados como cards, Pix pré-selecionado com Badge "5% off". O total muda conforme a escolha (Pix → `pixTotalCents`; cartão → subtotal em até `installments(subtotal)`). Frete: "A calcular. Confirmamos pelo WhatsApp." Submit "Confirmar pedido" → `submitted = orderNumber()`, `clear()`, scroll ao topo e foco no h1 de `OrderSuccess` (mascote, "Pedido recebido!", número, "Isto é uma demonstração: nenhum pagamento foi feito.", Button "Voltar à loja"). Carrinho vazio e sem `submitted` → EmptyState.
- [ ] **Step 7: Verify** no navegador em 375: enviar vazio foca o primeiro campo com erro, a navegação por teclado completa o form e a confirmação aparece.
- [ ] **Step 8: Commit** `feat: página do carrinho e checkout de demonstração`

---

### Task 10: 404, erro e SEO técnico

**Files:**
- Create: `app/not-found.tsx`, `app/error.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`
- Modify: `app/layout.tsx` (metadata raiz)

- [ ] **Step 1: Implement**: o `layout` metadata recebe `metadataBase: new URL(SITE_URL)`, `title: { default: "Jho Utilidades: tudo pra sua casa e muito mais", template: "%s | Jho Utilidades" }` (use `BRAND.name`), description, `openGraph: { locale: "pt_BR", siteName }`. `not-found`: `EmptyState pose="404"` com o título "Página não encontrada" + SearchBar + Button "Voltar ao início". `error.tsx` (client): "Algo deu errado" + Button "Tentar de novo" → `reset()`. `sitemap`: `/`, `/categorias`, cada `/c/slug`, cada `/p/slug`. `robots`: `allow: "/"`, `disallow: ["/checkout", "/carrinho", "/busca", "/dev"]`, `sitemap: SITE_URL + "/sitemap.xml"`. `opengraph-image`: `ImageResponse` 1200×630, fundo creme, nome da marca em ink, faixa azul, sem fontes externas (usa a fonte padrão).
- [ ] **Step 2: Verify** `npm run build` ok. `curl localhost:3000/sitemap.xml` lista 50 URLs (1+1+8+40). `/robots.txt` correto. `/p/nao-existe` → 404 com mascote.
- [ ] **Step 3: Commit** `feat: 404, erro, sitemap, robots e imagem OpenGraph`

---

### Task 11: E2E e verificação final

**Files:**
- Create: `tests/e2e/compra.spec.ts`
- Modify: `playwright.config.ts` (`webServer: npm run build && npm run start`, `use: { viewport: { width: 375, height: 812 }, locale: "pt-BR" }`, só chromium), `CLAUDE.md` (decisões novas, se houver)

- [ ] **Step 1: Write the E2E**: `page.goto("/")` → clica no primeiro link de `#ofertas` → espera h1 do produto → `getByRole("button", { name: "Adicionar ao carrinho" })` → `getByRole("dialog")` visível com o nome do produto → `getByRole("link", { name: "Finalizar compra" })` → preenche por `getByLabel` (Nome, E-mail, Celular, CEP "01310100", Endereço, Número, Bairro, Cidade, UF "SP") → "Confirmar pedido" → `expect(getByRole("heading", { name: "Pedido recebido!" }))` e o texto casa `/JHO-[A-Z0-9]{6}/`. Assert extra: contar os cliques de home→checkout = 3.
- [ ] **Step 2: Run** `npm run e2e` → PASS.
- [ ] **Step 3: Revisões com skills**: accessibility-review (contraste, teclado, ARIA da gaveta/filtros, alvos), impeccable/emil-design-eng (polimento de hover/press/gaveta), vercel-react-best-practices (fronteiras client/server, imagens, bundle), seo-audit (metadata, JSON-LD). Corrija o que for encontrado, com commit por correção.
- [ ] **Step 4: Lighthouse mobile** em `npm run start`: `npx lighthouse http://localhost:3000/ --preset=perf --form-factor=mobile` (e no produto) → todas as categorias ≥ 90.
- [ ] **Step 5: Screenshots** (webapp-testing / Playwright) de home, categoria, produto, carrinho e checkout em 375, 768 e 1280 → `docs/screenshots/`. Revise cada uma visualmente.
- [ ] **Step 6: Gate final** (verification-before-completion): `npm run typecheck && npm run lint && npm test && npm run build && npm run e2e`, todos verdes, com a saída colada no relatório.
- [ ] **Step 7: Commit** `test: fluxo E2E de compra e verificação final`
