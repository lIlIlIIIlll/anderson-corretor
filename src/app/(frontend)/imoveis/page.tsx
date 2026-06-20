import type { Metadata } from 'next'
import { SearchX } from 'lucide-react'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/getPayload'
import { PropertyCard } from '@/components/catalog/PropertyCard'
import { CatalogFilters } from '@/components/catalog/CatalogFilters'
import { CatalogPagination } from '@/components/catalog/CatalogPagination'

export const metadata: Metadata = {
  title: 'Imóveis à venda e para alugar',
  description:
    'Explore nosso catálogo de imóveis: apartamentos, casas, terrenos e imóveis comerciais. Filtre por tipo, bairro, preço e número de quartos.',
  alternates: { canonical: '/imoveis' },
}

const PAGE_SIZE = 9

type SearchParams = { [key: string]: string | string[] | undefined }

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

function buildWhere(sp: SearchParams): Where {
  const and: Where[] = [{ status: { not_equals: 'vendido' } }]

  const tipo = first(sp.tipo)
  const transacao = first(sp.transacao)
  const bairro = first(sp.bairro)
  const quartos = first(sp.quartos)
  const precoMax = first(sp.precoMax)
  const precoMin = first(sp.precoMin)

  if (tipo) and.push({ type: { equals: tipo } })
  if (transacao) and.push({ transaction: { equals: transacao } })
  if (bairro) and.push({ neighborhood: { like: bairro } })
  if (quartos && !Number.isNaN(Number(quartos)))
    and.push({ bedrooms: { greater_than_equal: Number(quartos) } })
  if (precoMax && !Number.isNaN(Number(precoMax)))
    and.push({ price: { less_than_equal: Number(precoMax) } })
  if (precoMin && !Number.isNaN(Number(precoMin)))
    and.push({ price: { greater_than_equal: Number(precoMin) } })

  return { and }
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const page = Math.max(1, Number(first(sp.pagina)) || 1)
  const where = buildWhere(sp)

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'properties',
    where,
    page,
    limit: PAGE_SIZE,
    depth: 1,
    sort: '-createdAt',
  })

  return (
    <>
      <section className="relative border-b border-border/60 bg-ink">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-primary" />
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Encontre seu próximo imóvel
          </h1>
          <p className="mt-2 max-w-xl text-white/80">
            Use os filtros para refinar a busca pelo imóvel ideal.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CatalogFilters />

        <p className="mt-8 text-sm text-muted-foreground">
          {result.totalDocs === 0
            ? 'Nenhum imóvel encontrado'
            : `${result.totalDocs} ${result.totalDocs === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`}
        </p>

        {result.docs.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
            <SearchX className="size-12 text-muted-foreground/40" />
            <p className="mt-4 font-medium text-foreground">Nenhum imóvel com esses filtros</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tente ajustar os critérios de busca.
            </p>
          </div>
        )}

        <CatalogPagination page={result.page ?? 1} totalPages={result.totalPages} />
      </div>
    </>
  )
}
