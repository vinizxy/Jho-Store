import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { BRAND, MAX_INSTALLMENTS, PIX_DISCOUNT } from "@/lib/config"

export const alt = `${BRAND.name}: tudo pra sua casa e muito mais`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// ImageResponse não lê CSS: as cores repetem os tokens de styles/tokens.css.
const ink = "#1A1A1F"
const blue = "#2C5AA0"
const lemon = "#FFD84D"

export default async function OpengraphImage() {
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/brand/logo.png"))).toString("base64")}`
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#FFFFFF", borderBottom: `24px solid ${blue}`, padding: 64, color: ink }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse só aceita <img> */}
        <img src={logo} alt="" width={613} height={218} />
        <div style={{ display: "flex", fontSize: 60, fontWeight: 700, maxWidth: 1000, lineHeight: 1.1 }}>Tudo pra sua casa, sem pesar no bolso.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {[`${Math.round(PIX_DISCOUNT * 100)}% off no Pix`, `Até ${MAX_INSTALLMENTS}x sem juros`].map((t, i) => (
            <div
              key={t}
              style={{ display: "flex", fontSize: 34, fontWeight: 700, padding: "14px 28px", border: `4px solid ${ink}`, borderRadius: 16, background: i === 0 ? lemon : "#FFFFFF", boxShadow: `8px 8px 0 ${ink}` }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
