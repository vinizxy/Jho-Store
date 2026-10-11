import Image from "next/image"
import { BRAND } from "@/lib/config"

export type MascotPose = "hero" | "empty" | "404" | "success" | "avatar"

// Arte oficial recortada por scripts/brand-assets.mjs a partir de assets/marca/.
const art: Record<MascotPose, { src: string; w: number; h: number; alt: string }> = {
  hero: { src: "/brand/mascote-acenando.webp", w: 418, h: 924, alt: `Mascote da ${BRAND.name} acenando com uma sacola` },
  success: { src: "/brand/mascote-acenando.webp", w: 418, h: 924, alt: `Mascote da ${BRAND.name} acenando` },
  empty: { src: "/brand/mascote-sacola.webp", w: 275, h: 687, alt: `Mascote da ${BRAND.name} com a sacola no ombro` },
  "404": { src: "/brand/mascote-sacola.webp", w: 275, h: 687, alt: `Mascote da ${BRAND.name} com a sacola no ombro` },
  avatar: { src: "/brand/avatar.webp", w: 208, h: 208, alt: `Mascote da ${BRAND.name}` },
}

/** decorative: o mascote só enfeita (texto ao lado já diz tudo), então o leitor de tela pula. */
export function Mascot({ pose, className = "", priority, decorative = true }: { pose: MascotPose; className?: string; priority?: boolean; decorative?: boolean }) {
  const a = art[pose]
  return <Image src={a.src} alt={decorative ? "" : a.alt} width={a.w} height={a.h} priority={priority} className={className} />
}
