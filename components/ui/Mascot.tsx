import Image from "next/image"

export type MascotPose = "hero" | "empty" | "404" | "success" | "avatar"

// Placeholders em public/mascote-*.svg. Para trocar pelo mascote oficial, substitua os arquivos.
const size: Record<MascotPose, [number, number]> = {
  hero: [220, 320],
  empty: [220, 320],
  "404": [220, 320],
  success: [220, 320],
  avatar: [88, 88],
}

export function Mascot({ pose, className = "", priority }: { pose: MascotPose; className?: string; priority?: boolean }) {
  const [w, h] = size[pose]
  return (
    <Image
      src={`/mascote-${pose}.svg`}
      alt=""
      width={w}
      height={h}
      priority={priority}
      className={className}
      unoptimized
    />
  )
}
