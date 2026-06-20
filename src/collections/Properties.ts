import type { CollectionConfig } from 'payload'
import { formatSlugHook } from '../lib/slug'

export const Properties: CollectionConfig = {
  slug: 'properties',
  labels: {
    singular: 'Imóvel',
    plural: 'Imóveis',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'transaction', 'price', 'status', 'featured'],
    group: 'Catálogo',
  },
  access: {
    read: () => true, // catálogo é público
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Gerado automaticamente a partir do título. Pode ser editado.',
      },
      hooks: {
        beforeValidate: [formatSlugHook('title')],
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descrição',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Preço (R$)',
          min: 0,
          admin: { width: '50%' },
        },
        {
          name: 'priceOnRequest',
          type: 'checkbox',
          label: 'Preço sob consulta',
          defaultValue: false,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Tipo',
          required: true,
          admin: { width: '33%' },
          options: [
            { label: 'Apartamento', value: 'apartamento' },
            { label: 'Casa', value: 'casa' },
            { label: 'Terreno', value: 'terreno' },
            { label: 'Comercial', value: 'comercial' },
          ],
        },
        {
          name: 'transaction',
          type: 'select',
          label: 'Transação',
          required: true,
          defaultValue: 'venda',
          admin: { width: '33%' },
          options: [
            { label: 'Venda', value: 'venda' },
            { label: 'Aluguel', value: 'aluguel' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          label: 'Status',
          required: true,
          defaultValue: 'disponivel',
          index: true,
          admin: { width: '34%' },
          options: [
            { label: 'Disponível', value: 'disponivel' },
            { label: 'Reservado', value: 'reservado' },
            { label: 'Vendido', value: 'vendido' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'bedrooms', type: 'number', label: 'Quartos', min: 0, admin: { width: '25%' } },
        { name: 'bathrooms', type: 'number', label: 'Banheiros', min: 0, admin: { width: '25%' } },
        { name: 'parking', type: 'number', label: 'Vagas', min: 0, admin: { width: '25%' } },
        { name: 'area', type: 'number', label: 'Área (m²)', min: 0, admin: { width: '25%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'neighborhood',
          type: 'text',
          label: 'Bairro',
          index: true,
          admin: { width: '50%' },
        },
        { name: 'city', type: 'text', label: 'Cidade', index: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'address',
      type: 'text',
      label: 'Endereço completo',
    },
    {
      type: 'row',
      fields: [
        { name: 'lat', type: 'number', label: 'Latitude', admin: { width: '50%' } },
        { name: 'lng', type: 'number', label: 'Longitude', admin: { width: '50%' } },
      ],
    },
    {
      name: 'amenities',
      type: 'select',
      label: 'Comodidades',
      hasMany: true,
      options: [
        { label: 'Piscina', value: 'piscina' },
        { label: 'Churrasqueira', value: 'churrasqueira' },
        { label: 'Academia', value: 'academia' },
        { label: 'Portaria 24h', value: 'portaria24h' },
        { label: 'Elevador', value: 'elevador' },
        { label: 'Varanda', value: 'varanda' },
        { label: 'Mobiliado', value: 'mobiliado' },
        { label: 'Aceita pet', value: 'petfriendly' },
        { label: 'Área de lazer', value: 'lazer' },
        { label: 'Condomínio fechado', value: 'condominiofechado' },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto de capa',
      admin: {
        description: 'Foto principal usada nos cards e no compartilhamento (WhatsApp/redes).',
      },
    },
    {
      name: 'photos',
      type: 'array',
      label: 'Galeria de fotos',
      labels: { singular: 'Foto', plural: 'Fotos' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destaque na home',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO (opcional)',
      admin: {
        description: 'Sobrescreve título/descrição padrão nas buscas. Se vazio, usa os do imóvel.',
      },
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Meta título' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta descrição' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Imagem de compartilhamento' },
      ],
    },
  ],
}
