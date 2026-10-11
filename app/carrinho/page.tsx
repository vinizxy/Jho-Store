import type { Metadata } from "next"
import { CartPageView } from "@/components/shop/CartPageView"
import { catalog } from "@/lib/catalog"

export const metadata: Metadata = { title: "Carrinho", robots: { index: false } }

export default async function CartPage() {
  const categories = await catalog.listCategories()
  return (
    <div className="container-page py-6 md:py-10">
      <CartPageView categories={categories} />
    </div>
  )
}
