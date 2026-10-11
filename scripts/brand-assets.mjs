// Recorta a arte da marca (logo-jhostore.jpg) em public/brand/*.webp com fundo transparente.
// Uso: node scripts/brand-assets.mjs [arquivo]. Coordenadas na imagem 975x1024.
import { mkdirSync } from "node:fs"
import sharp from "sharp"

const SRC = process.argv[2] ?? "assets/marca/logo-jhostore.jpg"
const OUT = "public/brand"
const WHITE = 232 // a partir daqui o pixel conta como fundo (JPEG não tem branco puro nas bordas)

const crops = {
  "mascote-acenando": { left: 8, top: 55, width: 432, height: 925 },
  "mascote-sacola": { left: 588, top: 28, width: 292, height: 694 },
  logo: { left: 338, top: 748, width: 625, height: 224 },
}

// Remove o fundo branco ligado às bordas (flood fill), preservando brancos internos (meias, tênis, olhos).
// keepAll=false: fica só a maior figura (mascotes). keepAll=true: fica tudo que não encosta no topo/esquerda (logo: mascote + letras).
async function cutout(region, { keepAll = false } = {}) {
  const { data, info } = await sharp(SRC).extract(region).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const isBg = (i) => data[i] >= WHITE && data[i + 1] >= WHITE && data[i + 2] >= WHITE
  const seen = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x)
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1)
  while (stack.length) {
    const p = stack.pop()
    if (seen[p] || !isBg(p * 4)) continue
    seen[p] = 1
    data[p * 4 + 3] = 0
    const x = p % w
    if (x > 0) stack.push(p - 1)
    if (x < w - 1) stack.push(p + 1)
    if (p >= w) stack.push(p - w)
    if (p < w * (h - 1)) stack.push(p + w)
  }
  // Sobras das figuras vizinhas viram áreas soltas: rotula as áreas opacas e filtra.
  const label = new Int32Array(w * h).fill(-1)
  const comps = []
  for (let s = 0; s < w * h; s++) {
    if (label[s] !== -1 || data[s * 4 + 3] === 0) continue
    const c = { id: comps.length, size: 0, top: false, left: false, pixels: [] }
    comps.push(c)
    stack.push(s)
    label[s] = c.id
    while (stack.length) {
      const p = stack.pop()
      c.size++
      c.pixels.push(p)
      const x = p % w
      if (p < w) c.top = true
      if (x === 0) c.left = true
      for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p >= w ? p - w : -1, p < w * (h - 1) ? p + w : -1]) {
        if (q >= 0 && label[q] === -1 && data[q * 4 + 3] !== 0) {
          label[q] = c.id
          stack.push(q)
        }
      }
    }
  }
  const largest = comps.reduce((a, b) => (b.size > a.size ? b : a))
  const keep = (c) => (keepAll ? !(c.top || c.left) && c.size > 20 : c === largest)
  for (const c of comps) if (!keep(c)) for (const p of c.pixels) data[p * 4 + 3] = 0
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 })
}

mkdirSync(OUT, { recursive: true })
for (const [name, region] of Object.entries(crops)) {
  const img = await cutout(region, { keepAll: name === "logo" })
  await img.webp({ quality: 90 }).toFile(`${OUT}/${name}.webp`)
}

// Avatar: o círculo escuro da arte, recortado em círculo.
const r = 104
const cx = 539
const cy = 614
const mask = Buffer.from(`<svg width="${r * 2}" height="${r * 2}"><circle cx="${r}" cy="${r}" r="${r - 1}"/></svg>`)
await sharp(SRC)
  .extract({ left: cx - r, top: cy - r, width: r * 2, height: r * 2 })
  .composite([{ input: mask, blend: "dest-in" }])
  .webp({ quality: 90 })
  .toFile(`${OUT}/avatar.webp`)

// PNGs para o que não lê WebP: imagem OpenGraph (Satori) e ícones do navegador.
await sharp(`${OUT}/logo.webp`).png().toFile(`${OUT}/logo.png`)
await sharp(`${OUT}/avatar.webp`).resize(64, 64).png().toFile("app/icon.png")
await sharp(`${OUT}/avatar.webp`).resize(180, 180).flatten({ background: "#1A1A1F" }).png().toFile("app/apple-icon.png")

for (const f of ["mascote-acenando", "mascote-sacola", "logo", "avatar"]) {
  const m = await sharp(`${OUT}/${f}.webp`).metadata()
  console.log(f, m.width, "x", m.height)
}
