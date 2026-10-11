import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Inter } from "next/font/google"
import { BottomNav } from "@/components/shop/BottomNav"
import { CartDrawer } from "@/components/shop/CartDrawer"
import { Footer } from "@/components/shop/Footer"
import { Header } from "@/components/shop/Header"
import { CartProvider } from "@/lib/cart/CartProvider"
import { catalog } from "@/lib/catalog"
import { BRAND, SITE_URL } from "@/lib/config"
import "./globals.css"

const display = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] })
const sans = Inter({ variable: "--font-inter", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND.name}: tudo pra sua casa e muito mais`, template: `%s | ${BRAND.name}` },
  description: "Utilidades para casa, cozinha, ferramentas, eletrônicos e mais. 5% de desconto no Pix e até 6x sem juros.",
  openGraph: { locale: "pt_BR", siteName: BRAND.name, type: "website" },
}

export const viewport: Viewport = { themeColor: "#FFFFFF" }

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categories = await catalog.listCategories()
  return (
    // data-scroll-behavior: o Next 16 desliga o smooth durante a navegação (troca de página começa no topo, instantânea)
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <CartProvider>
          <a
            href="#conteudo"
            className="sr-only z-50 rounded-card bg-blue px-4 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
          >
            Pular para o conteúdo
          </a>
          <Header categories={categories} />
          <main id="conteudo" className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <Footer categories={categories} />
          <BottomNav />
          <CartDrawer categories={categories} />
        </CartProvider>
      </body>
    </html>
  )
}
