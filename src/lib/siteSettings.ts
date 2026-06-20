import { cache } from 'react'
import { getPayloadClient } from './getPayload'

/** Busca o global de Configurações do Site (cacheado por requisição). */
export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})
