import type { ReactNode } from "react"
import { Mascot, type MascotPose } from "@/components/ui/Mascot"

type Props = {
  title: string
  text?: string
  action?: ReactNode
  pose?: Extract<MascotPose, "empty" | "404" | "success">
  as?: "h1" | "h2"
  children?: ReactNode
}

export function EmptyState({ title, text, action, pose = "empty", as: H = "h2", children }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <Mascot pose={pose} className="h-44 w-auto" />
      <H className="text-2xl font-extrabold md:text-3xl">{title}</H>
      {text && <p className="max-w-[40ch] text-muted">{text}</p>}
      {children}
      {action}
    </div>
  )
}
