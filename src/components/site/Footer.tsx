import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { InstagramIcon, FacebookIcon, LinkedinIcon } from './icons'
import type { SiteSetting } from '@/payload-types'

export function Footer({ settings }: { settings: SiteSetting }) {
  const brand = settings.seoDefaults?.siteName || 'Andrade Corretor'
  const { contact, social, about } = settings
  const year = 2026

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="h-1 bg-primary" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-serif text-xl font-semibold text-white">{brand}</p>
          <p className="mt-3 max-w-xs text-sm text-white/60">
            {settings.seoDefaults?.defaultDescription ||
              'Assessoria imobiliária de confiança para comprar, vender e alugar.'}
          </p>
          {about?.creci && (
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-white/50">
              {about.creci}
            </p>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Navegação</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Início
              </Link>
            </li>
            <li>
              <Link href="/imoveis" className="transition-colors hover:text-white">
                Imóveis
              </Link>
            </li>
            <li>
              <Link href="/#sobre" className="transition-colors hover:text-white">
                Sobre
              </Link>
            </li>
            <li>
              <Link href="/contato" className="transition-colors hover:text-white">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Contato</p>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            {contact?.phone && (
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" /> {contact.phone}
              </li>
            )}
            {contact?.email && (
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" /> {contact.email}
              </li>
            )}
            {contact?.address && (
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" /> {contact.address}
              </li>
            )}
          </ul>
          <div className="mt-4 flex gap-3">
            {social?.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/60 transition-colors hover:text-white">
                <InstagramIcon className="size-5" />
              </a>
            )}
            {social?.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/60 transition-colors hover:text-white">
                <FacebookIcon className="size-5" />
              </a>
            )}
            {social?.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/60 transition-colors hover:text-white">
                <LinkedinIcon className="size-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} {brand}. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por{' '}
            <a
              href="https://curricul-os.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/70 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Leonardo A. Andrade
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
