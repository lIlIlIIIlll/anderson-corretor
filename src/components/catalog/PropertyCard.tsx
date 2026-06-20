import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Car, Maximize2, MapPin, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Property } from '@/payload-types'
import { mediaUrl, mediaAlt, mediaIsVideo, videoPoster } from '@/lib/media'
import {
  formatPrice,
  formatArea,
  PROPERTY_TYPE_LABELS,
  TRANSACTION_LABELS,
} from '@/lib/format'

export function PropertyCard({ property }: { property: Property }) {
  const coverRaw = mediaUrl(property.coverImage)
  const cover = coverRaw && mediaIsVideo(property.coverImage) ? videoPoster(coverRaw) : coverRaw
  const href = `/imoveis/${property.slug}`
  const location = [property.neighborhood, property.city].filter(Boolean).join(', ')
  const area = formatArea(property.area)

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {cover ? (
          <Image
            src={cover}
            alt={mediaAlt(property.coverImage, property.title)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-secondary to-accent/10">
            <Building2 className="size-12 text-primary/30" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-primary text-primary-foreground hover:bg-primary">
            {TRANSACTION_LABELS[property.transaction]}
          </Badge>
          {property.status !== 'disponivel' && (
            <Badge variant="secondary" className="capitalize">
              {property.status === 'vendido' ? 'Vendido' : 'Reservado'}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          {PROPERTY_TYPE_LABELS[property.type]}
        </p>
        <h3 className="mt-1 line-clamp-1 font-serif text-lg font-semibold text-foreground">
          {property.title}
        </h3>
        {location && (
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </p>
        )}

        <p className="mt-3 font-serif text-xl font-bold text-primary">
          {formatPrice(property.price, {
            transaction: property.transaction,
            priceOnRequest: property.priceOnRequest,
          })}
        </p>

        {(property.bedrooms || property.bathrooms || property.parking || area) && (
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-4 text-sm text-muted-foreground">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1.5">
                <Bed className="size-4" /> {property.bedrooms}
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1.5">
                <Bath className="size-4" /> {property.bathrooms}
              </span>
            )}
            {property.parking != null && (
              <span className="flex items-center gap-1.5">
                <Car className="size-4" /> {property.parking}
              </span>
            )}
            {area && (
              <span className="flex items-center gap-1.5">
                <Maximize2 className="size-4" /> {area}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
