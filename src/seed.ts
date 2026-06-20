import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

/** Cria um valor richText (Lexical) simples a partir de um parágrafo de texto. */
const richText = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
        ],
      },
    ],
  },
})

const sampleProperties = [
  {
    title: 'Apartamento moderno no Centro',
    type: 'apartamento',
    transaction: 'venda',
    status: 'disponivel',
    price: 450000,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    area: 68,
    neighborhood: 'Centro',
    city: 'São Paulo',
    featured: true,
    amenities: ['elevador', 'varanda', 'portaria24h'],
    description: richText(
      'Apartamento reformado, planta inteligente e ótima iluminação natural. A poucos passos de comércio, transporte e serviços.',
    ),
  },
  {
    title: 'Casa espaçosa no Jardim América',
    type: 'casa',
    transaction: 'venda',
    status: 'disponivel',
    price: 890000,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    area: 180,
    neighborhood: 'Jardim América',
    city: 'São Paulo',
    featured: true,
    amenities: ['churrasqueira', 'lazer', 'condominiofechado'],
    description: richText(
      'Casa em condomínio fechado, com amplo quintal, área gourmet e suíte master. Ideal para famílias que buscam conforto e segurança.',
    ),
  },
  {
    title: 'Studio compacto para alugar',
    type: 'apartamento',
    transaction: 'aluguel',
    status: 'disponivel',
    price: 2200,
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    area: 32,
    neighborhood: 'Centro',
    city: 'São Paulo',
    featured: false,
    amenities: ['mobiliado', 'elevador'],
    description: richText(
      'Studio mobiliado, pronto para morar. Excelente custo-benefício para quem trabalha ou estuda na região central.',
    ),
  },
  {
    title: 'Terreno plano em bairro nobre',
    type: 'terreno',
    transaction: 'venda',
    status: 'disponivel',
    price: 320000,
    area: 250,
    neighborhood: 'Zona Sul',
    city: 'São Paulo',
    featured: false,
    amenities: ['condominiofechado'],
    description: richText(
      'Terreno pronto para construir, em rua tranquila e bem localizada. Documentação em ordem.',
    ),
  },
  {
    title: 'Sala comercial bem localizada',
    type: 'comercial',
    transaction: 'aluguel',
    status: 'disponivel',
    price: 3500,
    bathrooms: 1,
    parking: 1,
    area: 55,
    neighborhood: 'Centro',
    city: 'São Paulo',
    featured: false,
    amenities: ['elevador', 'portaria24h'],
    description: richText(
      'Sala comercial em prédio com infraestrutura completa, ideal para escritórios e consultórios.',
    ),
  },
  {
    title: 'Casa de alto padrão com piscina',
    type: 'casa',
    transaction: 'venda',
    status: 'disponivel',
    price: 1650000,
    bedrooms: 4,
    bathrooms: 4,
    parking: 4,
    area: 320,
    neighborhood: 'Alphaville',
    city: 'Barueri',
    featured: true,
    amenities: ['piscina', 'churrasqueira', 'academia', 'lazer', 'condominiofechado'],
    description: richText(
      'Residência de alto padrão com acabamento premium, piscina aquecida, espaço gourmet e ampla área de lazer.',
    ),
  },
] as const

const seed = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('🌱 Iniciando seed...')

  // Configurações do site (só se ainda não preenchidas)
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (!settings?.seoDefaults?.siteName) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        hero: {
          headline: 'Encontre o imóvel certo, com quem entende do assunto',
          subheadline:
            'Assessoria completa para comprar, vender ou alugar com segurança e tranquilidade.',
          ctaText: 'Falar no WhatsApp',
        },
        about: {
          creci: 'CRECI 000000-F',
        },
        contact: {
          whatsapp: '5511999998888',
          email: 'contato@andradecorretor.com.br',
          address: 'São Paulo — SP',
        },
        seoDefaults: {
          siteName: 'Andrade Corretor',
          defaultTitle: 'Andrade Corretor — Imóveis com assessoria de confiança',
          defaultDescription:
            'Apartamentos, casas, terrenos e imóveis comerciais para compra e aluguel, com assessoria de um corretor de confiança.',
        },
        aiAssistant: {
          enabled: true,
          welcomeMessage:
            'Olá! 👋 Me conte o que você procura (tipo, bairro, faixa de preço) que eu te mostro as melhores opções.',
          brokerNotifyWhatsapp: '5511999998888',
        },
      },
    })
    payload.logger.info('✅ Configurações do site definidas.')
  } else {
    payload.logger.info('ℹ️  Configurações do site já existem — mantidas.')
  }

  // Imóveis de exemplo (só se o catálogo estiver vazio)
  const count = await payload.count({ collection: 'properties' })
  if (count.totalDocs === 0) {
    for (const data of sampleProperties) {
      await payload.create({ collection: 'properties', data: data as never })
    }
    payload.logger.info(`✅ ${sampleProperties.length} imóveis de exemplo criados.`)
  } else {
    payload.logger.info(`ℹ️  Já existem ${count.totalDocs} imóveis — seed de imóveis pulado.`)
  }

  payload.logger.info('🌱 Seed concluído.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
