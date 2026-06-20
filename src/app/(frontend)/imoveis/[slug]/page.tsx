import { cache } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bed, Bath, Car, Maximize2, MapPin, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PropertyGallery } from '@/components/catalog/PropertyGallery'
import { RichText } from '@/components/RichText'
import { WhatsAppIcon } from '@/components/site/icons'
import { getPayloadClient } from '@/lib/getPayload'
import { getSiteSettings } from '@/lib/siteSettings'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { mediaUrl, mediaAlt, mediaIsVideo } from '@/lib/media'
import { lexicalToPlainText, truncate } from '@/lib/lexical'
import { propertyJsonLd, SERVER_URL } from '@/lib/seo'
import {
  formatPrice,
  formatArea,
  PROPERTY_TYPE_LABELS,
  TRANSACTION_LABELS,
  STATUS_LABELS,
  AMENITY_LABELS,
} from '@/lib/format'

const getProperty = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'properties',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const property = await getProperty(slug)
  if (!property) return { title: 'Imóvel não encontrado' }

  const title =
    property.seo?.metaTitle ||
    `${property.title}${property.neighborhood ? ` — ${property.neighborhood}` : ''}`
  const description =
    property.seo?.metaDescription ||
    truncate(lexicalToPlainText(property.description)) ||
    `${PROPERTY_TYPE_LABELS[property.type]} para ${TRANSACTION_LABELS[property.transaction].toLowerCase()} — ${formatPrice(property.price, { transaction: property.transaction, priceOnRequest: property.priceOnRequest })}.`

  const ogImage = mediaUrl(property.seo?.ogImage) || mediaUrl(property.coverImage)

  return {
    title,
    description,
    alternates: { canonical: `/imoveis/${property.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SERVER_URL}/imoveis/${property.slug}`,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await getProperty(slug)
  if (!property) notFound()

  const settings = await getSiteSettings()

  const images = [
    ...(mediaUrl(property.coverImage)
      ? [
          {
            url: mediaUrl(property.coverImage)!,
            alt: mediaAlt(property.coverImage, property.title),
            isVideo: mediaIsVideo(property.coverImage),
          },
        ]
      : []),
    ...(property.photos
      ?.map((p) =>
        typeof p.image !== 'number' && p.image?.url
          ? { url: p.image.url, alt: p.image.alt || property.title, isVideo: mediaIsVideo(p.image) }
          : null,
      )
      .filter((x): x is { url: string; alt: string; isVideo: boolean } => x !== null) ?? []),
  ]

  const location = [property.neighborhood, property.city].filter(Boolean).join(', ')
  const area = formatArea(property.area)

  const wa = buildWhatsAppLink(
    settings.contact?.whatsapp,
    `Olá! Tenho interesse no imóvel "${property.title}" (${SERVER_URL}/imoveis/${property.slug}). Pode me passar mais informações?`,
  )

  const specs = [
    property.bedrooms != null && { icon: Bed, label: 'Quartos', value: property.bedrooms },
    property.bathrooms != null && { icon: Bath, label: 'Banheiros', value: property.bathrooms },
    property.parking != null && { icon: Car, label: 'Vagas', value: property.parking },
    area && { icon: Maximize2, label: 'Área', value: area },
  ].filter(Boolean) as { icon: typeof Bed; label: string; value: string | number }[]

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd(property)) }}
      />

      <Link
        href="/imoveis"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar ao catálogo
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PropertyGallery images={images} title={property.title} />
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                {TRANSACTION_LABELS[property.transaction]}
              </Badge>
              <Badge variant="secondary">{PROPERTY_TYPE_LABELS[property.type]}</Badge>
              {property.status !== 'disponivel' && (
                <Badge variant="outline">{STATUS_LABELS[property.status]}</Badge>
              )}
            </div>

            <h1 className="mt-4 font-serif text-2xl font-bold text-foreground">{property.title}</h1>
            {location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {location}
              </p>
            )}

            <p className="mt-5 font-serif text-3xl font-bold text-primary">
              {formatPrice(property.price, {
                transaction: property.transaction,
                priceOnRequest: property.priceOnRequest,
              })}
            </p>

            <Button asChild size="lg" className="mt-6 w-full">
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="size-4" /> Tenho interesse
              </a>
            </Button>
          </div>
        </aside>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {specs.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex flex-col items-center gap-1 rounded-xl border border-border/70 bg-card p-4 text-center"
                  >
                    <spec.icon className="size-5 text-primary" />
                    <span className="font-semibold text-foreground">{spec.value}</span>
                    <span className="text-xs text-muted-foreground">{spec.label}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-8" />
            </>
          )}

          {property.description && (
            <section>
              <h2 className="font-serif text-xl font-bold text-foreground">Sobre o imóvel</h2>
              <div className="prose prose-neutral mt-4 max-w-none text-muted-foreground">
                <RichText data={property.description} />
              </div>
            </section>
          )}

          {property.amenities && property.amenities.length > 0 && (
            <section className="mt-8">
              <h2 className="font-serif text-xl font-bold text-foreground">Comodidades</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 text-primary" /> {AMENITY_LABELS[a] || a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {property.address && (
            <section className="mt-8">
              <h2 className="font-serif text-xl font-bold text-foreground">Localização</h2>
              <p className="mt-3 flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" /> {property.address}
              </p>
            </section>
          )}
        </div>
      </div>
    </article>
  )
}
