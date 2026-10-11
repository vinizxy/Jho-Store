import { Boxes, CookingPot, Headphones, PawPrint, Puzzle, Sofa, Sparkles, Wrench, type LucideProps } from "lucide-react"
import type { IconName } from "@/lib/catalog/types"

const icons = { Sofa, CookingPot, Wrench, Headphones, Sparkles, Puzzle, PawPrint, Boxes } satisfies Record<IconName, unknown>

export function CategoryIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = icons[name]
  return <Icon aria-hidden strokeWidth={2} {...props} />
}
