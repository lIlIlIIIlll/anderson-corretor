import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Lead',
    plural: 'Leads',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'contact', 'status', 'source', 'createdAt'],
    group: 'Atendimento',
  },
  access: {
    // Criação só pelo servidor (chat de IA via Local API, que ignora o access control).
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nome' },
    { name: 'contact', type: 'text', label: 'Contato (WhatsApp/telefone/e-mail)' },
    {
      name: 'interestedProperties',
      type: 'relationship',
      relationTo: 'properties',
      hasMany: true,
      label: 'Imóveis de interesse',
    },
    {
      name: 'conversationSummary',
      type: 'textarea',
      label: 'Resumo da conversa',
    },
    {
      name: 'source',
      type: 'select',
      label: 'Origem',
      defaultValue: 'ai-chat',
      options: [
        { label: 'Chat de IA', value: 'ai-chat' },
        { label: 'Formulário de contato', value: 'contact-form' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'novo',
      options: [
        { label: 'Novo', value: 'novo' },
        { label: 'Contatado', value: 'contatado' },
        { label: 'Fechado', value: 'fechado' },
      ],
    },
  ],
}
