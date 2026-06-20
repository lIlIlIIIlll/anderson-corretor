import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configurações do Site',
  admin: {
    group: 'Configurações',
  },
  access: {
    read: () => true, // o front lê os textos/contatos
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: 'Seção principal (topo da home)',
              fields: [
                { name: 'headline', type: 'text', label: 'Título principal' },
                { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
                { name: 'ctaText', type: 'text', label: 'Texto do botão (CTA)' },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Imagem de fundo',
                },
              ],
            },
          ],
        },
        {
          label: 'Sobre',
          fields: [
            {
              name: 'about',
              type: 'group',
              label: 'Sobre o corretor',
              fields: [
                { name: 'bio', type: 'richText', label: 'Biografia / apresentação' },
                { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto do corretor' },
                { name: 'creci', type: 'text', label: 'CRECI' },
              ],
            },
          ],
        },
        {
          label: 'Contato',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Dados de contato',
              fields: [
                { name: 'phone', type: 'text', label: 'Telefone' },
                {
                  name: 'whatsapp',
                  type: 'text',
                  label: 'WhatsApp (só dígitos, ex.: 5511999998888)',
                },
                { name: 'email', type: 'email', label: 'E-mail' },
                { name: 'address', type: 'text', label: 'Endereço' },
                { name: 'mapEmbedUrl', type: 'text', label: 'URL do mapa (embed do Google Maps)' },
              ],
            },
            {
              name: 'social',
              type: 'group',
              label: 'Redes sociais',
              fields: [
                { name: 'instagram', type: 'text', label: 'Instagram (URL)' },
                { name: 'facebook', type: 'text', label: 'Facebook (URL)' },
                { name: 'linkedin', type: 'text', label: 'LinkedIn (URL)' },
              ],
            },
          ],
        },
        {
          label: 'Depoimentos',
          fields: [
            {
              name: 'testimonials',
              type: 'array',
              label: 'Depoimentos de clientes',
              labels: { singular: 'Depoimento', plural: 'Depoimentos' },
              fields: [
                { name: 'author', type: 'text', label: 'Autor' },
                { name: 'text', type: 'textarea', label: 'Depoimento' },
                { name: 'rating', type: 'number', label: 'Nota (1 a 5)', min: 1, max: 5 },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoDefaults',
              type: 'group',
              label: 'SEO padrão do site',
              fields: [
                { name: 'siteName', type: 'text', label: 'Nome do site' },
                { name: 'defaultTitle', type: 'text', label: 'Título padrão' },
                { name: 'defaultDescription', type: 'textarea', label: 'Descrição padrão' },
                {
                  name: 'defaultOgImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Imagem padrão de compartilhamento',
                },
              ],
            },
          ],
        },
        {
          label: 'Assistente IA',
          fields: [
            {
              name: 'aiAssistant',
              type: 'group',
              label: 'Chat assistente (IA)',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Ativar chat de IA no site',
                  defaultValue: true,
                },
                {
                  name: 'welcomeMessage',
                  type: 'textarea',
                  label: 'Mensagem de boas-vindas',
                },
                {
                  name: 'brokerNotifyWhatsapp',
                  type: 'text',
                  label: 'WhatsApp do corretor para receber leads (só dígitos)',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
