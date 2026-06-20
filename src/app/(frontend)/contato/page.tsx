import type { Metadata } from 'next'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/site/icons'
import { getSiteSettings } from '@/lib/siteSettings'
import { buildWhatsAppLink } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com o corretor para comprar, vender ou alugar seu imóvel.',
  alternates: { canonical: '/contato' },
}

export default async function ContatoPage() {
  const settings = await getSiteSettings()
  const { contact } = settings
  const wa = buildWhatsAppLink(
    contact?.whatsapp,
    'Olá! Vim pelo site e gostaria de mais informações.',
  )

  const items = [
    contact?.phone && { icon: Phone, label: 'Telefone', value: contact.phone, href: `tel:${contact.phone}` },
    contact?.email && { icon: Mail, label: 'E-mail', value: contact.email, href: `mailto:${contact.email}` },
    contact?.address && { icon: MapPin, label: 'Endereço', value: contact.address, href: undefined },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[]

  return (
    <>
      <section className="relative border-b border-border/60 bg-ink">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-primary" />
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">Fale comigo</h1>
          <p className="mt-2 max-w-xl text-white/80">
            Estou à disposição para ajudar você a encontrar, vender ou alugar um imóvel.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Canais de atendimento</h2>
          <ul className="mt-6 space-y-5">
            {items.map((item) => (
              <li key={item.label} className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="font-medium text-foreground hover:underline">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-medium text-foreground">{item.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <Button asChild size="lg" className="mt-8 bg-[#25D366] text-white hover:bg-[#25D366]/90">
            <a href={wa} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-5" /> Conversar no WhatsApp
            </a>
          </Button>
        </div>

        {contact?.mapEmbedUrl && (
          <div className="overflow-hidden rounded-2xl border border-border/70 shadow-sm">
            <iframe
              src={contact.mapEmbedUrl}
              title="Localização"
              className="h-full min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </>
  )
}
