import { ImageResponse } from "next/og"
import { BRAND, MAX_INSTALLMENTS, PIX_DISCOUNT } from "@/lib/config"

export const alt = `${BRAND.name}: tudo pra sua casa e muito mais`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// ImageResponse não lê CSS: as cores repetem os tokens de styles/tokens.css.
const ink = "#1A1A1F"
const blue = "#2C5AA0"
const paper = "#EEF2F8"
const lemon = "#FFD84D"

export default function OpengraphImage() {
  const [first, ...rest] = BRAND.name.split(" ")
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: paper, padding: 72, color: ink }}>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 800, letterSpacing: -3 }}>
          {first}&nbsp;<span style={{ color: blue }}>{rest.join(" ")}</span>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, maxWidth: 900, lineHeight: 1.1 }}>
          Tudo pra sua casa, sem pesar no bolso.
        </div>
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
