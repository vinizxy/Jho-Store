// Gera docs/screenshots/<tela>-<largura>.png. Uso: npm run build && npx next start -p 3100, depois node scripts/screenshots.mjs
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"

const BASE = process.env.BASE_URL ?? "http://localhost:3100"
const OUT = "docs/screenshots"
const widths = [375, 768, 1280]
const cart = JSON.stringify([
  { slug: "panela-antiaderente-24cm", name: "Panela Antiaderente 24 cm com Tampa de Vidro", priceCents: 7990, categorySlug: "cozinha", qty: 1 },
  { slug: "fone-bluetooth-sem-fio", name: "Fone Bluetooth Sem Fio com Estojo", priceCents: 12990, categorySlug: "eletronicos", qty: 2 },
])
const pages = [
  ["home", "/"],
  ["categoria", "/c/cozinha"],
  ["produto", "/p/panela-antiaderente-24cm"],
  ["carrinho", "/carrinho"],
  ["checkout", "/checkout"],
]

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 900 }, locale: "pt-BR" })
  await ctx.addInitScript((c) => localStorage.setItem("jho-cart-v1", c), cart)
  const page = await ctx.newPage()
  for (const [name, path] of pages) {
    await page.goto(BASE + path, { waitUntil: "networkidle" })
    await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true })
  }
  await ctx.close()
}
await browser.close()
console.log(`ok: ${pages.length * widths.length} screenshots em ${OUT}`)
