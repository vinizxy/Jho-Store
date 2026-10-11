# Jho Utilidades — Vitrine v1 (Subprojeto 1) — Design

Data: 2026-10-11 · Status: aguardando revisão

## 1. Objetivo

Protótipo profissional da loja generalista "Jho Utilidades" para apresentar ao dono, já estruturado para virar loja real. Somente front-end: catálogo mock, carrinho no navegador, checkout só de tela.

**Princípio nº 1:** bonito e simples de navegar. Em conflito, simplicidade vence decoração.

**Critérios de sucesso**
- Compra em ≤ 3 cliques a partir da home: card do produto → "Adicionar" (abre gaveta) → "Finalizar compra" → checkout.
- Lighthouse mobile > 90 (Performance, A11y, SEO, Best Practices) na home e no produto.
- WCAG AA: contraste, teclado, foco visível, alvos ≥ 44px.
- typecheck, lint, build, Vitest e Playwright verdes; screenshots em 375/768/1280.

## 2. Stack (versões verificadas em 2026-10-11)

| Item | Versão / escolha |
|---|---|
| Next.js (App Router) | 16.4 |
| React | 19.3 |
| TypeScript | strict |
| Tailwind CSS | 4.3 (tokens via `@theme`) |
| Ícones | `lucide-react` (única dependência de UI) |
| Fontes | `next/font/google`: **Bricolage Grotesque** (display), **Inter** (corpo) |
| Testes | Vitest 5 (lógica) · Playwright 1.64 (1 fluxo E2E) |
| Node | 24 |

Sem libs de estado, formulário, carrossel ou componentes. Gaveta = `<dialog>` nativo.

## 3. Configuração única

`lib/config.ts` é o único lugar para valores de negócio:

```ts
export const BRAND = { name: "Jho Utilidades", short: "Jho" } // nome atual; trocar só aqui
export const PIX_DISCOUNT = 0.05          // 5%
export const MAX_INSTALLMENTS = 6         // até 6x sem juros
export const MIN_INSTALLMENT_CENTS = 1000 // parcela mínima R$ 10
export const MAX_QTY_PER_ITEM = 10
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "" // vazio → links de WhatsApp somem
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
```

`.env.example`: `NEXT_PUBLIC_WHATSAPP=5511999999999`, `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

## 4. Design tokens (`styles/tokens.css`, fonte única)

```
--color-blue:   #2C5AA0  primária (CTA, links, preço)
--color-ink:    #1A1A1F  texto, bordas, sombra
--color-cream:  #FFF1DC  fundo da página
--color-sky:    #A8DADC  apoio (chips ativos, faixas)
--color-white:  #FFFFFF  superfícies (cards, header, gaveta)
--color-lemon:  #FFD84D  acento raro: selo Pix / oferta. Nunca como cor de texto.
--color-muted:  #4A4A55  texto secundário (contraste ≥ 7:1 no creme)
--border:       2px solid ink
--shadow-brut:  4px 4px 0 ink   (hover → 2px 2px 0 + translate 2px: "afunda")
--radius:       12px (cards/botões) · 999px (chips)
--ease / dur:   150ms ease-out
```

Contrastes conferidos: azul sobre creme 6,1:1 · branco sobre azul 6,8:1 · ink sobre limão 13:1. Sem vermelho, gradiente, blur ou parallax. `prefers-reduced-motion` zera transições e translates.

**Contenção:** borda e sombra só em botões, cards, chips, badges e selos. Seções, header e rodapé ficam lisos, com bastante espaço. No máximo 2 níveis de ênfase por tela.

Tints de categoria para placeholders: `sky`, `lemon` (claro), `blue-50 #DCE6F5`, `cream-dark #F6DDB8`, alternados por categoria.

## 5. Modelo de dados

```ts
type Category = { slug: string; name: string; icon: IconName; tint: Tint }

type Product = {
  id: string; slug: string; name: string; description: string
  categorySlug: string
  priceCents: number          // preço cheio (cartão)
  compareAtCents?: number     // "de R$ X" em ofertas
  badge?: "oferta" | "mais-vendido" | "novo"
  images: string[]            // vazio → placeholder estilizado
  specs: { label: string; value: string }[]
  soldCount: number           // ordena "mais vendidos"
}
```

Mock: `lib/catalog/data.json` com 8 categorias (casa, cozinha, ferramentas, eletrônicos, beleza, brinquedos, pet, organização) × 5 produtos = 40 produtos com nomes e preços realistas.

**Regras de preço** (`lib/cart/pricing.ts`, funções puras, centavos inteiros):
- `pixPrice(c) = Math.round(c * (1 - PIX_DISCOUNT))`
- `installments(c) = { n, valueCents }`, com `n = clamp(floor(c / MIN_INSTALLMENT_CENTS), 1, MAX_INSTALLMENTS)` e `valueCents = Math.ceil(c / n)` (a soma das parcelas nunca fica abaixo do total).
- `discountPercent(price, compareAt) = Math.round((1 - price/compareAt) * 100)`
- Total do carrinho: `subtotal = Σ price*qty`. O desconto Pix é aplicado uma vez sobre o subtotal.
- `formatBRL(c)` usa `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.

O preço exibido em destaque é sempre o **Pix** ("R$ 94,05 no Pix"). Abaixo, discreto: "ou R$ 99,00 em até 6x de R$ 16,50 sem juros".

## 6. Arquitetura

```
app/
  layout.tsx            fontes, Header, CategoryNav (desktop), BottomNav (mobile), Footer, CartProvider, CartDrawer
  page.tsx              Home
  c/[slug]/page.tsx     Categoria (+ loading.tsx)
  categorias/page.tsx   Grade de categorias com ícones grandes (destino do "Categorias" no mobile)
  busca/page.tsx        Busca (+ loading.tsx)
  p/[slug]/page.tsx     Produto (+ loading.tsx)
  carrinho/page.tsx     Carrinho em página cheia
  checkout/page.tsx     Checkout
  not-found.tsx · error.tsx · sitemap.ts · robots.ts · opengraph-image.tsx
components/ui/          Button, Badge, Chip, Price, Skeleton, Mascot, Icon
components/shop/        ProductCard, ProductGrid, ProductImage, CategoryNav, CategoryGrid,
                        SearchBar, FilterChips, SortSelect, CartDrawer, CartLine, AddToCart,
                        BuyBar, TrustBadges, Breadcrumbs, EmptyState, JsonLd, CheckoutForm
lib/config.ts
lib/catalog/            types.ts · repository.ts (interface CatalogRepository) · mock.ts · data.json · search.ts · index.ts (exporta `catalog`)
lib/cart/               pricing.ts · reducer.ts · CartProvider.tsx (context + localStorage)
styles/tokens.css
tests/unit/ (Vitest) · tests/e2e/ (Playwright)
```

**CatalogRepository** (assíncrona, para trocar por Supabase sem mexer na UI):
`listCategories()`, `getCategory(slug)`, `listProducts({ category?, q?, filter?, sort? })`, `getProduct(slug)`, `getRelated(product, n)`, `getDeals(n)`, `getBestSellers(n)`. `lib/catalog/index.ts` exporta `catalog: CatalogRepository = mockCatalog`, e esse é o único ponto de troca.

**Busca:** normaliza com `toLowerCase` + `normalize("NFD")` sem acentos e casa todos os termos em nome + categoria + descrição. Assim "panela" encontra "Panela" e "eletronico" encontra "Eletrônicos".

**Server vs Client:** tudo é Server Component, exceto `CartProvider`, `CartDrawer`, `AddToCart`, `BuyBar`, `SortSelect`, `CheckoutForm`, contador do carrinho no header e galeria (só quando há > 1 imagem). Filtros e ordenação ficam na URL (`?f=oferta&ordem=menor-preco`). Os chips são `<Link>`, então funcionam sem JS e o link é compartilhável. Páginas de categoria e produto usam `generateStaticParams` (SSG). Busca é dinâmica.

**Carrinho:** `useReducer` (`add`, `remove`, `setQty`, `clear`, `hydrate`). Cada item guarda `{ slug, name, priceCents, categorySlug, qty }`, um snapshot suficiente para mock. Qty vai de 1 a `MAX_QTY_PER_ITEM`. Persiste em `localStorage` (`jho-cart-v1`) com try/catch. Se o JSON vier inválido, volta para o carrinho vazio. A hidratação acontece no mount; antes dela, o contador não aparece (evita mismatch de SSR).

## 7. Navegação e layout

- **Header fixo (todas as larguras):** logo "Jho Utilidades" (texto display + mascote-avatar pequeno) · busca (GET `/busca?q=`), sempre visível, ocupando uma segunda linha no mobile · botão do carrinho com contador, que abre a gaveta.
- **Desktop ≥ 1024:** faixa simples abaixo do header com as 8 categorias em texto. Sem mega-menu.
- **Mobile < 768:** barra inferior fixa (Início, Categorias → `/categorias`, Busca → `/busca` com foco no input, Carrinho → `/carrinho`). Alvos de 56px, com `padding-bottom` para safe-area.
- **Gaveta do carrinho:** `<dialog>` lateral direita (no mobile, tela cheia). Abre ao clicar no carrinho do header e ao adicionar um produto (mensagem "Adicionado ao carrinho" com `aria-live`). CTA único: "Finalizar compra". Secundário discreto: "Continuar comprando". Esc, clique no fundo e botão X fecham. O foco volta para quem abriu.
- **Breadcrumbs** em categoria e produto.

## 8. Páginas

**Home:** hero estático (título curto + subtítulo + CTA "Ver ofertas" + mascote à direita/abaixo) → faixa de categorias (ícones, rolagem horizontal no mobile) → Ofertas do dia (4–8 cards) → Mais vendidos (4–8) → TrustBadges (Pix 5% off · Entrega para todo o Brasil · Troca em até 7 dias) → Footer (WhatsApp, categorias, aviso "protótipo — pagamento ainda não ativo").

**Categoria `/c/[slug]`:** breadcrumbs, título + contagem, 4 chips (Todos · Em oferta · Até R$ 50 · Até R$ 100; faixas de preço comparam o preço Pix) + SortSelect (Relevância, Menor preço, Maior preço, Mais vendidos), grade 2 col (mobile) / 3 (tablet) / 4 (desktop).

**Busca `/busca`:** input com o termo, contagem, mesma grade, chips e ordenação. Sem resultados: mascote + "Não achamos '{q}'" + chips de categorias + Mais vendidos. Sem termo: categorias + mais vendidos.

**Produto `/p/[slug]`:** breadcrumbs · galeria (placeholder ou imagens, com miniaturas como botões) · nome (h1) · badge · preço Pix em destaque + "de R$ X" riscado se houver · parcelado · "Frete calculado no checkout" · AddToCart (com quantidade −/+) · link discreto "Dúvidas? Fale no WhatsApp" (só se a env existir) · descrição · especificações (`<dl>`) · Relacionados (4 da mesma categoria). No mobile, BuyBar fixa acima da BottomNav com preço Pix + "Adicionar". JSON-LD: Product + Offer (preço Pix não; Offer usa o preço cheio, `priceCurrency: BRL`, `availability: InStock`) + BreadcrumbList.

**Carrinho `/carrinho` e gaveta:** linhas com miniatura, nome, −/qty/+, remover, preço da linha. Resumo: subtotal, desconto Pix, total no Pix, "ou em até 6x". Vazio: mascote + "Seu carrinho está vazio" + CTA "Ver ofertas".

**Checkout `/checkout` (uma página, sem cadastro, só tela):**
1. Seus dados: nome, e-mail, celular/WhatsApp.
2. Entrega: CEP, endereço, número, complemento (opcional), bairro, cidade, UF (select). Frete: "a calcular. Vamos confirmar pelo WhatsApp."
3. Pagamento: radio **Pix (5% off, selecionado)** em destaque · Cartão (até 6x sem juros). Nenhum campo de cartão.
4. Resumo do pedido (fixo à direita no desktop; no mobile, recolhível acima do botão).
5. CTA único: "Confirmar pedido". A validação usa HTML nativo (`required`, `type=email`, `inputmode=numeric`, `pattern` para CEP), com mensagens em PT simples ligadas por `aria-describedby`. Ao confirmar: tela "Pedido recebido!" com mascote, número fictício `JHO-XXXXXX`, aviso "Isto é uma demonstração, nenhum pagamento foi feito", e o carrinho é limpo. Carrinho vazio no checkout → redireciona para o estado vazio do carrinho.

**404:** mascote + "Página não encontrada" + busca + link para início. **error.tsx:** "Algo deu errado" + botão "Tentar de novo" (`reset`).

## 9. Componentes-chave

- **ProductCard:** a área inteira é um `<Link>`. Mostra ProductImage (quadrada), badge, nome (`line-clamp-2`), preço Pix e parcelado. Hover/foco: afunda. Sem botão de adicionar no card (mantém um CTA por tela; o card leva ao produto).
  - *Exceção avaliada e rejeitada:* um "+" no card reduziria a 2 cliques, mas cria duas ações por card. Os 3 cliques já cumprem a meta.
- **ProductImage:** com `images[0]`, usa `next/image` (sizes responsivos). Sem imagem, mostra um bloco no tint da categoria com ícone grande + nome curto, com `role="img"` e `aria-label` = nome do produto.
- **Mascot:** `<Image src="/mascote.svg">` com variações por `pose` (`hero`, `empty`, `404`, `avatar`) → arquivos `public/mascote-*.svg`. Na v1 são placeholders ilustrados simples (silhueta estilizada nas cores da marca), trocáveis sem mudar código.
- **Button:** variantes `primary` (azul, borda, sombra), `secondary` (branco, borda) e `ghost` (só texto). Altura mínima de 48px.
- **Price:** recebe `cents` e `compareAt?` e renderiza Pix, riscado e parcelado de forma consistente em todo o site.

## 10. Estados

| Estado | Onde | Como |
|---|---|---|
| Carregando | categoria, busca, produto | `loading.tsx` com Skeleton na forma dos cards |
| Vazio | carrinho/gaveta | mascote + CTA |
| Sem resultados | busca, filtro sem itens | mascote + sugestões |
| Erro | rota | `error.tsx` com retry |
| 404 | slug inexistente | `notFound()` → `not-found.tsx` |
| Adicionado | AddToCart | gaveta abre + `aria-live` "Adicionado ao carrinho" |

## 11. SEO

`metadataBase = SITE_URL`. Template de título `%s | Jho Utilidades`. Metadata por rota (`generateMetadata` em categoria/produto/busca, com busca `noindex`). OpenGraph padrão via `opengraph-image.tsx` (marca + cores). `sitemap.ts` com home, categorias e produtos. `robots.ts` permite tudo, exceto `/checkout`, `/carrinho` e `/busca`. HTML semântico: `header`, `nav[aria-label]`, `main`, `footer`, `h1` único por página. JSON-LD no produto (e BreadcrumbList na categoria).

## 12. Acessibilidade

Skip link "Pular para o conteúdo". Foco visível: outline 3px azul + offset 2px em tudo que é focável. Gaveta: `<dialog>` modal (foco preso nativamente), `aria-labelledby`. Chips: `aria-current="page"` no ativo. Contador do carrinho: `aria-label="Carrinho, 3 itens"`. Botões de quantidade com rótulos ("Diminuir quantidade de X"). `lang="pt-BR"`. Alvos ≥ 44px. Nenhuma informação só por cor.

## 13. Testes e verificação

- **Vitest (`tests/unit`):** `pricing` (pix, parcelas incluindo parcela mínima, desconto %, formatBRL), `reducer` (add soma qty, limite máx., remove, setQty ≤ 0 remove, hydrate inválido), `search` (acentos, múltiplos termos).
- **Playwright (`tests/e2e/compra.spec.ts`), viewport 375:** home → clica no primeiro card de Ofertas → Adicionar → gaveta visível → Finalizar compra → preenche o form → Confirmar → vê "Pedido recebido".
- **Final:** `tsc --noEmit`, `eslint`, `next build`, Vitest, Playwright, Lighthouse mobile (home e produto), axe via accessibility-review, screenshots de home/categoria/produto/carrinho/checkout em 375/768/1280.

## 14. Fora do escopo (YAGNI)

Contas, avaliações, pagamento real (subprojeto 3), admin (4), Supabase (2), rastreio, marketplaces, cálculo real de frete, favoritos, cupons, dark mode, i18n.

## 15. Entrega

Repo git, `README.md` (como rodar/testar), `.env.example`, `CLAUDE.md` com contexto e decisões. O deploy na Vercel só acontece quando o Vinicius pedir.
