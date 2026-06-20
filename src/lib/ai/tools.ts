import { tool } from 'ai'
import { z } from 'zod'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/getPayload'
import { formatPrice, formatArea } from '@/lib/format'

/** Busca imóveis reais no catálogo. A IA deve chamar antes de recomendar qualquer imóvel. */
export const searchProperties = tool({
  description:
    'Busca imóveis disponíveis no catálogo real do corretor. Use SEMPRE antes de recomendar qualquer imóvel. Retorna apenas imóveis que realmente existem.',
  inputSchema: z.object({
    type: z
      .enum(['apartamento', 'casa', 'terreno', 'comercial'])
      .optional()
      .describe('Tipo do imóvel'),
    transaction: z.enum(['venda', 'aluguel']).optional().describe('Finalidade: compra ou aluguel'),
    neighborhood: z.string().optional().describe('Bairro ou região de interesse'),
    minBedrooms: z.number().optional().describe('Número mínimo de quartos'),
    maxPrice: z.number().optional().describe('Preço máximo em reais'),
  }),
  execute: async ({ type, transaction, neighborhood, minBedrooms, maxPrice }) => {
    const payload = await getPayloadClient()
    const and: Where[] = [{ status: { equals: 'disponivel' } }]
    if (type) and.push({ type: { equals: type } })
    if (transaction) and.push({ transaction: { equals: transaction } })
    if (neighborhood) and.push({ neighborhood: { like: neighborhood } })
    if (minBedrooms) and.push({ bedrooms: { greater_than_equal: minBedrooms } })
    if (maxPrice) and.push({ price: { less_than_equal: maxPrice } })

    const res = await payload.find({
      collection: 'properties',
      where: { and },
      limit: 6,
      depth: 0,
      sort: '-featured',
    })

    return {
      count: res.totalDocs,
      results: res.docs.map((p) => ({
        title: p.title,
        url: `/imoveis/${p.slug}`,
        price: formatPrice(p.price, {
          transaction: p.transaction,
          priceOnRequest: p.priceOnRequest,
        }),
        type: p.type,
        transaction: p.transaction,
        bedrooms: p.bedrooms ?? undefined,
        bathrooms: p.bathrooms ?? undefined,
        area: formatArea(p.area) ?? undefined,
        neighborhood: p.neighborhood ?? undefined,
        city: p.city ?? undefined,
      })),
    }
  },
})

/** Registra um lead e encaminha ao corretor. A IA chama quando tiver nome + contato. */
export const captureLead = tool({
  description:
    'Registra um lead (visitante interessado) com nome e contato, encaminhando ao corretor. Use assim que tiver coletado o nome e um contato (WhatsApp/telefone/e-mail).',
  inputSchema: z.object({
    name: z.string().describe('Nome do visitante'),
    contact: z.string().describe('Contato: WhatsApp, telefone ou e-mail'),
    interestedSlugs: z
      .array(z.string())
      .optional()
      .describe('Slugs dos imóveis de interesse (ex.: "casa-no-centro")'),
    summary: z.string().describe('Resumo do que o visitante procura'),
  }),
  execute: async ({ name, contact, interestedSlugs, summary }) => {
    const payload = await getPayloadClient()

    let interestedProperties: number[] = []
    if (interestedSlugs?.length) {
      const found = await payload.find({
        collection: 'properties',
        where: { slug: { in: interestedSlugs } },
        limit: 20,
        depth: 0,
      })
      interestedProperties = found.docs.map((d) => d.id)
    }

    const lead = await payload.create({
      collection: 'leads',
      data: {
        name,
        contact,
        conversationSummary: summary,
        interestedProperties,
        source: 'ai-chat',
        status: 'novo',
      },
    })

    return {
      success: true,
      leadId: lead.id,
      message: 'Contato registrado e encaminhado ao corretor. Em breve entraremos em contato!',
    }
  },
})
