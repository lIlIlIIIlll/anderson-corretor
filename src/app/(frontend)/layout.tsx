import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './styles.css'
import { getSiteSettings } from '@/lib/siteSettings'
import { realEstateAgentJsonLd } from '@/lib/seo'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { FloatingWhatsApp } from '@/components/site/FloatingWhatsApp'
import { ChatWidget } from '@/components/chat/ChatWidget'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(serverUrl),
  title: {
    default: 'Andrade Corretor — Imóveis com assessoria de confiança',
    template: '%s | Andrade Corretor',
  },
  description:
    'Encontre o imóvel ideal com a assessoria de um corretor de confiança. Apartamentos, casas, terrenos e imóveis comerciais para compra e aluguel.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Andrade Corretor',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const whatsapp = settings.contact?.whatsapp
  const siteName = settings.seoDefaults?.siteName

  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentJsonLd(settings)) }}
        />
        <Header whatsapp={whatsapp} siteName={siteName} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <FloatingWhatsApp whatsapp={whatsapp} />
        {settings.aiAssistant?.enabled !== false && (
          <ChatWidget welcomeMessage={settings.aiAssistant?.welcomeMessage} />
        )}
      </body>
    </html>
  )
}
