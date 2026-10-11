import {
  Armchair, Bed, BedDouble, Blinds, Blocks, Bone, Boxes, Brush, Briefcase, Cable, Car, Cat, ChefHat, CookingPot,
  Crosshair, Dice5, Dog, Drill, Flame, Footprints, Hand, Headphones, Lamp, Layers, LayoutGrid, Library, Microwave,
  Package, Palette, PawPrint, PlugZap, Puzzle, Ruler, ScanFace, Shirt, Sofa, Soup, Sparkles, Speaker, Utensils, Watch,
  Wind, Wrench, type LucideProps,
} from "lucide-react"
import type { IconName } from "@/lib/catalog/types"

// Mapa explícito (sem import *): só estes ícones entram no bundle.
const icons = {
  Armchair, Bed, BedDouble, Blinds, Blocks, Bone, Boxes, Brush, Briefcase, Cable, Car, Cat, ChefHat, CookingPot,
  Crosshair, Dice5, Dog, Drill, Flame, Footprints, Hand, Headphones, Lamp, Layers, LayoutGrid, Library, Microwave,
  Package, Palette, PawPrint, PlugZap, Puzzle, Ruler, ScanFace, Shirt, Sofa, Soup, Sparkles, Speaker, Utensils, Watch,
  Wind, Wrench,
} satisfies Record<IconName, unknown>

export function CatalogIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = icons[name]
  return <Icon aria-hidden strokeWidth={2} {...props} />
}
