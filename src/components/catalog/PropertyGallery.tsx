'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Building2, Play } from 'lucide-react'
import { videoPoster } from '@/lib/media'
import { cn } from '@/lib/utils'

type GalleryItem = { url: string; alt: string; isVideo?: boolean }

export function PropertyGallery({ images, title }: { images: GalleryItem[]; title: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-secondary to-accent/10">
        <Building2 className="size-20 text-primary/30" />
      </div>
    )
  }

  const current = images[active]

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-secondary">
        {current.isVideo ? (
          <video
            key={current.url}
            src={current.url}
            poster={videoPoster(current.url)}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={current.url}
            alt={current.alt || title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'relative aspect-square overflow-hidden rounded-lg bg-secondary ring-2 transition',
                i === active ? 'ring-primary' : 'ring-transparent hover:ring-border',
              )}
            >
              <Image
                src={img.isVideo ? videoPoster(img.url) : img.url}
                alt={img.alt || `${title} — mídia ${i + 1}`}
                fill
                sizes="20vw"
                className="object-cover"
              />
              {img.isVideo && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="size-5 fill-white text-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
