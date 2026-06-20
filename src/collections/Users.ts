import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuário',
    plural: 'Usuários',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Sistema',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome',
    },
  ],
}
