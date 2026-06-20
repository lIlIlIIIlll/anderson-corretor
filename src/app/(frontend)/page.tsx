import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, ShieldCheck, Home, Handshake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/catalog/PropertyCard'
import { Reveal } from '@/components/site/Reveal'
import { RichText } from '@/components/RichText'
import { WhatsAppIcon } from '@/components/site/icons'
import { getSiteSettings } from '@/lib/siteSettings'
import { getPayloadClient } from '@/lib/getPayload'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { mediaUrl } from '@/lib/media'

export default async function HomePage() {
  const settings = await getSiteSettings()
  const payload = await getPayloadClient()

  const featured = await payload.find({
    collection: 'properties',
    where: {
      featured: { equals: true },
      status: { equals: 'disponivel' },
    },
    limit: 6,
    depth: 1,
    sort: '-createdAt',
  })

  const hero = settings.hero
  const about = settings.about
  const wa = buildWhatsAppLink(
    settings.contact?.whatsapp,
    'Olá! Vim pelo site e gostaria de mais informações.',
  )
  const heroBg = mediaUrl(hero?.backgroundImage)
  const aboutPhoto = mediaUrl(about?.photo)
  const testimonials = settings.testimonials ?? []

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink">
        {heroBg ? (
          <>
            <Image src={heroBg} alt="" fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-ink/75" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-black" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-primary" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start px-4 py-28 sm:px-6 md:py-36 lg:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
              <ShieldCheck className="size-3.5" /> {about?.creci || 'Corretor credenciado'}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 max-w-3xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              {hero?.headline || 'Encontre o imóvel certo, com quem entende do assunto'}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              {hero?.subheadline ||
                'Assessoria completa para comprar, vender ou alugar com segurança e tranquilidade.'}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/imoveis">
                  Ver imóveis <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-4" /> {hero?.ctaText || 'Falar no WhatsApp'}
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: Home, title: 'Curadoria de imóveis', text: 'Seleção criteriosa das melhores oportunidades para você.' },
            { icon: ShieldCheck, title: 'Negociação segura', text: 'Documentação e processo conduzidos com total transparência.' },
            { icon: Handshake, title: 'Atendimento próximo', text: 'Acompanhamento personalizado do início ao fim.' },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      {featured.docs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-primary">
                  Seleção exclusiva
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                  Imóveis em destaque
                </h2>
              </div>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/imoveis">
                  Ver todos <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.docs.map((property, i) => (
              <Reveal key={property.id} delay={(i % 3) * 0.1}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* SOBRE */}
      <section id="sobre" className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary shadow-lg">
              {aboutPhoto ? (
                <Image
                  src={aboutPhoto}
                  alt="Foto do corretor"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <ShieldCheck className="size-16 text-primary/30" />
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-primary">
                Sobre
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                Assessoria de confiança
              </h2>
              {about?.bio ? (
                <div className="prose prose-neutral mt-5 max-w-none text-muted-foreground">
                  <RichText data={about.bio} />
                </div>
              ) : (
                <p className="mt-5 text-muted-foreground">
                  Com experiência no mercado imobiliário, ofereço um atendimento próximo e
                  transparente para que você tome a melhor decisão — seja comprar, vender ou alugar.
                </p>
              )}
              {about?.creci && (
                <p className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <ShieldCheck className="size-4" /> {about.creci}
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center font-serif text-3xl font-bold text-foreground sm:text-4xl">
              O que dizem os clientes
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id || i} delay={(i % 3) * 0.1}>
                <figure className="flex h-full flex-col rounded-xl border border-border/70 bg-card p-6 shadow-sm">
                  {t.rating != null && (
                    <div className="flex gap-0.5 text-primary">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <Star key={s} className="size-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote className="mt-3 flex-1 text-muted-foreground">“{t.text}”</blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-foreground">
                    {t.author}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="bg-primary">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="max-w-2xl font-serif text-3xl font-bold text-white sm:text-4xl">
            Não encontrou o que procura? Fale comigo.
          </h2>
          <p className="max-w-xl text-white/80">
            Me conte o que você precisa e eu busco as melhores opções para o seu perfil.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <a href={wa} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" /> Falar no WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </>
  )
}
