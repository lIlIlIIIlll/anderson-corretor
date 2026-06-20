'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CatalogPagination({ page, totalPages }: { page: number; totalPages: number }) {
  const pathname = usePathname()
  const sp = useSearchParams()

  if (totalPages <= 1) return null

  const hrefFor = (p: number) => {
    const params = new URLSearchParams(sp.toString())
    params.set('pagina', String(p))
    return `${pathname}?${params.toString()}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="Paginação">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={cn(
          'flex size-9 items-center justify-center rounded-md border border-border text-sm transition-colors hover:bg-secondary',
          page <= 1 && 'pointer-events-none opacity-40',
        )}
      >
        <ChevronLeft className="size-4" />
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          className={cn(
            'flex size-9 items-center justify-center rounded-md border text-sm transition-colors',
            p === page
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border hover:bg-secondary',
          )}
        >
          {p}
        </Link>
      ))}

      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={cn(
          'flex size-9 items-center justify-center rounded-md border border-border text-sm transition-colors hover:bg-secondary',
          page >= totalPages && 'pointer-events-none opacity-40',
        )}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  )
}
