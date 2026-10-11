import { MessageCircle, Truck } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AddToCart, BuyBar } from "@/components/shop/AddToCart"
import { Breadcrumbs } from "@/components/shop/Breadcrumbs"
import { JsonLd } from "@/components/shop/JsonLd"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { ProductImage } from "@/components/shop/ProductImage"
import { Badge } from "@/components/ui/Badge"
import { Price } from "@/components/ui/Price"
import { discountPercent } from "@/lib/cart/pricing"
import { catalog } from "@/lib/catalog"
import { BRAND, SITE_URL, whatsappUrl } from "@/lib/config"

export async function generateStaticParams() {
  return (await catalog.listProducts({})).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const product = await catalog.getProduct(slug)
  if (!product) return {}
  const description = product.description.slice(0, 155)
  return {
    title: product.name,
    description,
    alternates: { canonical: `/p/${slug}` },
    openGraph: { title: product.name, description, url: `/p/${slug}`, images: product.images.slice(0, 1) },
  }
}

export default async function ProductPage({ params }: PageProps<"/p/[slug]">) {
  const { slug } = await params
  const product = await catalog.getProduct(slug)
  if (!product) notFound()

  const [category, related, categories] = await Promise.all([
    catalog.getCategory(product.categorySlug),
    catalog.getRelated(product, 4),
    catalog.listCategories(),
  ])
  const url = `/p/${slug}`
  const off = product.compareAtCents ? discountPercent(product.priceCents, product.compareAtCents) : 0
  const wa = whatsappUrl(`Olá! Tenho interesse em: ${product.name}`)

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    category: category?.name,
    brand: { "@type": "Brand", name: BRAND.name },
    ...(product.images.length > 0 && { image: product.images.map((i) => new URL(i, SITE_URL).toString()) }),
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: new URL(url, SITE_URL).toString(),
    },
  }

  return (
    <div className="container-page flex flex-col gap-4 pt-4 pb-28 md:py-8">
      <JsonLd data={productLd} />
      <Breadcrumbs
        items={[
          { name: "Início", href: "/" },
          ...(category ? [{ name: category.name, href: `/c/${category.slug}` }] : []),
          { name: product.name },
        ]}
        currentPath={url}
      />

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="overflow-hidden rounded-card border-2 border-ink shadow-brut md:self-start">
          <ProductImage
            name={product.name}
            image={product.images[0]}
            category={category ?? undefined}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="max-md:aspect-[4/3]"
          />
        </div>

        <div className="flex flex-col gap-5">
          {(off > 0 || product.badge) && (
            <div className="flex gap-2">
              {off > 0 && <Badge kind="oferta">-{off}%</Badge>}
              {product.badge && product.badge !== "oferta" && <Badge kind={product.badge} />}
            </div>
          )}
          <h1 className="text-3xl leading-tight font-bold md:text-4xl">{product.name}</h1>
          <Price cents={product.priceCents} compareAtCents={product.compareAtCents} size="lg" />
          <p className="flex items-center gap-2 text-sm">
            <Truck aria-hidden className="size-5" />
            Frete calculado no checkout
          </p>
          <AddToCart product={product} />
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-blue hover:underline">
              <MessageCircle aria-hidden className="size-5" />
              Dúvidas? Fale no WhatsApp
            </a>
          )}

          <section aria-labelledby="sobre" className="flex flex-col gap-2 border-t-2 border-ink pt-5">
            <h2 id="sobre" className="text-xl font-bold">
              Sobre o produto
            </h2>
            <p className="max-w-[65ch] leading-relaxed">{product.description}</p>
          </section>

          {product.specs.length > 0 && (
            <section aria-labelledby="detalhes" className="flex flex-col gap-3">
              <h2 id="detalhes" className="text-xl font-bold">
                Detalhes
              </h2>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {product.specs.map((s) => (
                  <div key={s.label} className="rounded-card border-2 border-ink bg-white p-3">
                    <dt className="text-xs text-muted">{s.label}</dt>
                    <dd className="font-semibold">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>

      <section aria-labelledby="relacionados" className="flex flex-col gap-5 pt-10">
        <h2 id="relacionados" className="text-2xl font-bold md:text-3xl">
          Você também pode gostar
        </h2>
        <ProductGrid products={related} categories={categories} />
      </section>

      <BuyBar product={product} />
    </div>
  )
}
