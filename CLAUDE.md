@AGENTS.md

# Jho Utilidades — contexto do projeto

Responda em PT-BR, direto ao ponto. Mantenha este arquivo atualizado a cada decisão nova (seção "Decisões").

## O que é
Loja online generalista do tio do Vinicius (vende também em Mercado Livre/Amazon/Shopee). Subprojeto 1 = vitrine front-end: protótipo profissional para apresentar ao dono, pronto para virar loja real. "Jho" é fixo; o nome completo vive só em `lib/config.ts` (`BRAND`).

Roadmap: 1 vitrine (este) · 2 Supabase · 3 pagamento Mercado Pago Checkout Pro · 4 admin.

## Princípio nº 1
Bonito E simples de navegar. Em conflito, simplicidade vence decoração. Compra em ≤ 3 cliques a partir da home. Uma ação primária por tela.

## Direção visual
Tema **azul e preto, das roupas do mascote** (camiseta azul `#2C5AA0`, bermuda preta `#1A1A1F`), azul-claro da alça da sacola `#93CCF2` como apoio, fundo `#EEF2F8`, amarelo-limão só para Pix/ofertas. Header branco (logo como na arte: "Jho" preto + nome em azul), faixa de categorias, rodapé e barra inferior pretos, hero azul.
Neo-brutalismo amigável com contenção: borda preta 2px + sombra sólida 4px 4px só em botões, cards, chips, badges e selos. Resto calmo e espaçoso. Cores/sombras/fontes só em `styles/tokens.css` (paleta padrão do Tailwind desligada). Em fundo azul/preto, troque `--focus` para o contorno de foco continuar visível. Sem vermelho, gradiente, blur, parallax ou carrossel automático. Motion 120–200ms, respeita reduced-motion. Fontes: Fredoka (títulos, combina com o letreiro da logo) + Inter (corpo). Mascote só em hero, carrinho vazio, 404, sucesso e avatar.

## Stack
Next 16.4 (App Router, `cacheComponents` + `partialPrefetching` ligados), React 19.3, TS strict, Tailwind 4.3, lucide-react, Vitest, Playwright. Leia `node_modules/next/dist/docs/` antes de usar API do Next.

- Catálogo: `lib/catalog/` atrás de `CatalogRepository`; trocar implementação só em `lib/catalog/index.ts`.
- Carrinho: `lib/cart/` (reducer puro + Context + localStorage `jho-cart-v1`).
- Dinheiro sempre em centavos inteiros; formatar só com `formatBRL`.
- Server Components por padrão; com cacheComponents, quem lê `searchParams` fica dentro de `<Suspense>`.

## Fora do escopo da v1
Contas, avaliações, pagamento real, admin, Supabase, rastreio, marketplaces, frete real.

## Documentos
- Spec: `docs/superpowers/specs/2026-10-11-jho-store-vitrine-design.md`
- Plano: `docs/superpowers/plans/2026-10-11-jho-store-vitrine.md`

## Decisões
- 2026-10-11 · Marca: "Jho Utilidades" (antes "Jho Store").
- Gaveta do carrinho = `<dialog>` nativo (foco preso e Esc de graça).
- Filtros e ordenação na URL (`?f=` e `?ordem=`); chips são links e funcionam sem JS.
- Chips: Todos · Em oferta · Até R$ 50 · Até R$ 100 (comparam preço Pix). "Mais vendidos" só como ordenação.
- Categorias no mobile = página `/categorias` (não gaveta).
- Card de produto sem botão "+": home → produto → adicionar → finalizar = 3 cliques.
- Parcelamento: até 6x sem juros com parcela mínima R$ 10. Pix 5% sobre o subtotal.
- Checkout: só tela, frete "a calcular, confirmamos pelo WhatsApp", pedido fictício `JHO-XXXXXX`.
- `@types/node` 24 (Node 24) para compatibilidade com Vitest 5.
- 2026-10-11 · Tema trocado de creme para azul e preto (pedido do Vinicius, com base no mascote oficial). Tokens: `cream`→`paper`, tint `creamDark`→`slate`.
- Marca: **Jho Store** (é o que está na logo oficial). Arte original em `assets/marca/logo-jhostore.jpg`; `node scripts/brand-assets.mjs` recorta em `public/brand/` (mascote acenando, mascote com sacola, avatar, logo) e gera `app/icon.png` e `app/apple-icon.png`.
- Uso do mascote: hero e pedido confirmado = acenando; carrinho vazio e 404 = sacola no ombro; header (celular) e rodapé = avatar. Header ≥ sm = logo oficial.
- Hero: mascote sobre círculo azul-claro com borda e sombra (a camiseta azul sumia no fundo azul).
- Crítica impeccable #1 (2026-10-11, 28/40) aplicada: erro do checkout com linguagem própria (borda tracejada + ícone + texto preto, nunca o azul de marca) e resumo "Faltam N informações"; carrinho mostra preço Pix em destaque (o preço não "sobe"); checkout enxuto via `ChromeGate` (sem busca, categorias, rodapé e barra inferior; "Voltar ao carrinho" no header); botão "Confirmar pedido · total" + reforço "Você não paga nada agora" com avatar; cards com 1 selo (desconto ganha), parcelado curto, placeholder só com ícone; home com 4 por trilho sem repetir produto, `/ofertas` como página própria; vantagens depois dos trilhos.
- Fonte de títulos: **Fredoka** (arredondada, próxima do letreiro da logo); vai até peso 700, então títulos usam `font-bold`.
- Produto: no mobile o único botão de compra é a BuyBar fixa (AddToCart só no desktop). Galeria com miniaturas fica para quando houver produto com mais de 1 foto.
- Checkout: erros só aparecem no envio e somem ao corrigir (validar no blur fazia o clique em "Confirmar" se perder). `<select>` de UF é controlado.
- `<html data-scroll-behavior="smooth">`: sem isso o Next 16 abria páginas no meio da rolagem.
- `scroll-padding` no `html` para o header e a barra inferior não cobrirem o foco.
- 404 de slug inexistente: com PPR o status HTTP é 200, mas o Next injeta `noindex` (comportamento documentado).
- Tints dos placeholders só na família do azul (sky, blue50, slate); amarelo-limão só em Pix/ofertas.
- Favicon = avatar do mascote (`app/icon.svg`).
- Lighthouse mobile local (2026-10-11): a11y/bp/SEO 100, CLS 0, performance 87 (LCP 3,1s simulado; o peso é o JS do framework). Medir de novo no PageSpeed após deploy na Vercel.
- E2E sem emulação "iPhone 13" do Playwright (o toque emulado falhava no card); viewport 375 em Chromium.
