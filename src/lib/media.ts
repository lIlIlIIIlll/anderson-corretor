import type { Media } from '@/payload-types'

type MediaRef = number | Media | null | undefined

/** Retorna a URL de um campo de upload (relação com a collection Media). */
export const mediaUrl = (media: MediaRef): string | null => {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}

/** Retorna o texto alternativo de uma mídia (ou um fallback). */
export const mediaAlt = (media: MediaRef, fallback = ''): string => {
  if (!media || typeof media === 'number') return fallback
  return media.alt || fallback
}

/** Indica se a mídia é um vídeo (pelo mimeType). */
export const mediaIsVideo = (media: MediaRef): boolean => {
  if (!media || typeof media === 'number') return false
  return Boolean(media.mimeType?.startsWith('video/'))
}

/** Gera a URL de um frame-pôster (.jpg) a partir da URL de um vídeo do Cloudinary. */
export const videoPoster = (url: string): string => url.replace(/\.[^./]+$/, '.jpg')
