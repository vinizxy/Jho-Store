# Jho Store: vitrine

Protótipo da loja online Jho Store: home, categorias, busca, produto, carrinho e checkout de demonstração (sem pagamento real).

## Como rodar

Requisito: Node 24.

```bash
npm install
cp .env.example .env.local   # edite o número do WhatsApp
npm run dev                  # http://localhost:3000
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build && npm start` | build e servidor de produção |
| `npm test` | testes de preço, carrinho, busca e checkout (Vitest) |
| `npm run e2e` | fluxo de compra no navegador (Playwright) |
| `npm run typecheck` / `npm run lint` | checagens de código |
| `node scripts/screenshots.mjs` | prints das telas em 375/768/1280 (com `npx next start -p 3100` rodando) |

## Onde mudar o quê

| Quero mudar… | Arquivo |
|---|---|
| Nome da marca, desconto Pix, parcelas, limites | `lib/config.ts` |
| Cores, bordas, sombras, fontes | `styles/tokens.css` |
| Produtos e categorias (mock) | `lib/catalog/data.json` |
| Fonte do catálogo (ex.: Supabase) | `lib/catalog/index.ts` |
| Logo e mascote | troque `assets/marca/logo-jhostore.jpg` e rode `node scripts/brand-assets.mjs` (gera `public/brand/` e os ícones) |
| Foto de um produto | campo `images` do produto no `data.json` |

Documentação de design: `docs/superpowers/specs/`. Plano: `docs/superpowers/plans/`.
