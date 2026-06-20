import { v2 as cloudinary } from 'cloudinary'
import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/** Pasta no Cloudinary onde as mídias ficam organizadas. */
const FOLDER = 'andrade-corretor'

const VIDEO_EXTENSIONS = new Set([
  'mp4',
  'webm',
  'ogv',
  'ogg',
  'mov',
  'm4v',
  'avi',
  'mkv',
  '3gp',
])

const stripExt = (filename: string) => filename.replace(/\.[^/.]+$/, '')
const extOf = (filename: string) => (filename.split('.').pop() || '').toLowerCase()
const publicIdFor = (filename: string) => `${FOLDER}/${stripExt(filename)}`
const resourceTypeFor = (filename: string): 'image' | 'video' =>
  VIDEO_EXTENSIONS.has(extOf(filename)) ? 'video' : 'image'

/**
 * Adapter de storage do Cloudinary para @payloadcms/plugin-cloud-storage.
 * Sobe o arquivo, gera a URL pública (res.cloudinary.com) e cuida da exclusão.
 */
export const cloudinaryAdapter: Adapter = (): GeneratedAdapter => ({
  name: 'cloudinary',

  handleUpload: async ({ file }) => {
    const publicId = publicIdFor(file.filename)
    await new Promise<void>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: 'auto', // detecta imagem ou vídeo automaticamente
          overwrite: true,
          use_filename: false,
          unique_filename: false,
        },
        (error) => (error ? reject(error) : resolve()),
      )
      stream.end(file.buffer)
    })
  },

  handleDelete: async ({ filename }) => {
    await cloudinary.uploader.destroy(publicIdFor(filename), {
      resource_type: resourceTypeFor(filename),
      invalidate: true,
    })
  },

  generateURL: ({ filename }) => {
    const resourceType = resourceTypeFor(filename)
    if (resourceType === 'video') {
      // Mantém a extensão de vídeo para garantir compatibilidade no <video>.
      return cloudinary.url(publicIdFor(filename), {
        resource_type: 'video',
        secure: true,
        format: extOf(filename) || 'mp4',
      })
    }
    return cloudinary.url(publicIdFor(filename), { resource_type: 'image', secure: true })
  },

  staticHandler: (_req, { params: { filename } }) => {
    const resourceType = resourceTypeFor(filename)
    const url =
      resourceType === 'video'
        ? cloudinary.url(publicIdFor(filename), {
            resource_type: 'video',
            secure: true,
            format: extOf(filename) || 'mp4',
          })
        : cloudinary.url(publicIdFor(filename), { resource_type: 'image', secure: true })
    return Response.redirect(url, 302)
  },
})
