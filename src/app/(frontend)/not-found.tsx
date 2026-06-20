import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="font-serif text-7xl font-bold text-primary sm:text-8xl">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-foreground sm:text-3xl">
        Página não encontrada
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        O imóvel ou página que você procura pode ter sido removido, vendido, ou talvez o link
        esteja incorreto.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/imoveis">
            <Search className="size-4" /> Ver imóveis
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <Home className="size-4" /> Voltar ao início
          </Link>
        </Button>
      </div>
    </section>
  )
}
