import type { FieldHook } from 'payload'

/** Converte um texto em slug amigável para URL (remove acentos, espaços e símbolos). */
export const formatSlug = (val: string): string =>
  val
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // remove acentos (diacríticos)
    .replace(/[^\w\s-]/g, '') // remove símbolos
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()

/**
 * Hook de campo que gera o slug automaticamente a partir de outro campo (ex.: title),
 * mas respeita um slug digitado manualmente.
 */
export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string' && value.length > 0) {
      return formatSlug(value)
    }

    if (operation === 'create' || !value) {
      const fallbackData = data?.[fallback]
      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData)
      }
    }

    return value
  }
