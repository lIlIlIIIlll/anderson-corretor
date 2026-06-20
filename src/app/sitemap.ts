import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/getPayload'
import { SERVER_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const props = await payload.find({
    collection: 'properties',
    where: { status: { not_equals: 'vendido' } },
    limit: 1000,
    depth: 0,
    pagination: false,
  })

  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SERVER_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SERVER_URL}/imoveis`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SERVER_URL}/contato`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const propertyRoutes: MetadataRoute.Sitemap = props.docs.map((p) => ({
    url: `${SERVER_URL}/imoveis/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...propertyRoutes]
}
