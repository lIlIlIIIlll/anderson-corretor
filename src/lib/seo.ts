import type { Property, SiteSetting } from '@/payload-types'
import { mediaUrl } from './media'
import { lexicalToPlainText, truncate } from './lexical'
import { PROPERTY_TYPE_LABELS, TRANSACTION_LABELS } from './format'

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const abs = (path: string) => (path.startsWith('http') ? path : `${SERVER_URL}${path}`)

/** JSON-LD do corretor (RealEstateAgent / LocalBusiness) — motor do SEO local. */
export function realEstateAgentJsonLd(settings: SiteSetting) {
  const name = settings.seoDefaults?.siteName || 'Andrade Corretor'
  const sameAs = [
    settings.social?.instagram,
    settings.social?.facebook,
    settings.social?.linkedin,
  ].filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name,
    url: SERVER_URL,
    ...(settings.contact?.phone && { telephone: settings.contact.phone }),
    ...(settings.contact?.email && { email: settings.contact.email }),
    ...(settings.about?.creci && { identifier: settings.about.creci }),
    ...(settings.contact?.address && {
      address: { '@type': 'PostalAddress', streetAddress: settings.contact.address },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  }
}

/** JSON-LD do imóvel (Product + Offer) — padrão suportado pelo Google. */
export function propertyJsonLd(property: Property) {
  const images: string[] = []
  const cover = mediaUrl(property.coverImage)
  if (cover) images.push(abs(cover))
  property.photos?.forEach((p) => {
    const url = typeof p.image !== 'number' ? p.image?.url : null
    if (url) images.push(abs(url))
  })

  const description =
    truncate(lexicalToPlainText(property.description)) ||
    `${PROPERTY_TYPE_LABELS[property.type]} para ${TRANSACTION_LABELS[property.transaction].toLowerCase()}${property.neighborhood ? ` em ${property.neighborhood}` : ''}.`

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description,
    ...(images.length > 0 && { image: images }),
    ...(property.price && !property.priceOnRequest
      ? {
          offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'BRL',
            availability:
              property.status === 'disponivel'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            url: abs(`/imoveis/${property.slug}`),
          },
        }
      : {}),
  }
}
