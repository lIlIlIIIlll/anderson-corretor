import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Mídia',
    plural: 'Mídias',
  },
  admin: {
    group: 'Catálogo',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo (acessibilidade/SEO)',
      required: true,
    },
  ],
  upload: {
    // O redimensionamento responsivo é feito sob demanda pelo Cloudinary (f_auto,q_auto,w_*),
    // então não pré-geramos múltiplos tamanhos aqui.
    // Vídeo liberado para tours de imóveis (armazenado/entregue pelo Cloudinary).
    mimeTypes: ['image/*', 'video/*'],
  },
}
