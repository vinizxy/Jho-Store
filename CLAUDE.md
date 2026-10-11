@AGENTS.md

# Jho Utilidades — contexto do projeto

Responda em PT-BR, direto ao ponto. Mantenha este arquivo atualizado a cada decisão nova (seção "Decisões").

## O que é
Loja online generalista do tio do Vinicius (vende também em Mercado Livre/Amazon/Shopee). Subprojeto 1 = vitrine front-end: protótipo profissional para apresentar ao dono, pronto para virar loja real. "Jho" é fixo; o nome completo vive só em `lib/config.ts` (`BRAND`).

Roadmap: 1 vitrine (este) · 2 Supabase · 3 pagamento Mercado Pago Checkout Pro · 4 admin.

## Princípio nº 1
Bonito E simples de navegar. Em conflito, simplicidade vence decoração. Compra em ≤ 3 cliques a partir da home. Uma ação primária por tela.

## Direção visual
Neo-brutalismo amigável com contenção: borda preta 2px + sombra sólida 4px 4px só em botões, cards, chips, badges e selos. Resto calmo e espaçoso. Cores/sombras/fontes só em `styles/tokens.css` (paleta padrão do Tailwind desligada). Sem vermelho, gradiente, blur, parallax ou carrossel automático. Motion 120–200ms, respeita reduced-motion. Fontes: Bricolage Grotesque (display) + Inter. Mascote só em hero, carrinho vazio, 404, sucesso e avatar.

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
