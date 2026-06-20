import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Cliente do Payload Local API para uso em Server Components / rotas.
 * O `getPayload` já memoiza a instância internamente, então isso é barato.
 */
export const getPayloadClient = async () => {
  return getPayload({ config: configPromise })
}
