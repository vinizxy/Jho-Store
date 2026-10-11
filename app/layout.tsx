import { Bricolage_Grotesque, Inter } from "next/font/google"
import "./globals.css"

const display = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] })
const sans = Inter({ variable: "--font-inter", subsets: ["latin"] })

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  )
}
