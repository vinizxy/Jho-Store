import type { Metadata } from "next"
import { CheckoutForm } from "@/components/shop/CheckoutForm"

export const metadata: Metadata = { title: "Finalizar compra", robots: { index: false } }

export default function CheckoutPage() {
  return (
    <div className="container-page py-6 md:py-10">
      <CheckoutForm />
    </div>
  )
}
