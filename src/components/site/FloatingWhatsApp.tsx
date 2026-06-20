'use client'

import { motion } from 'framer-motion'
import { WhatsAppIcon } from './icons'
import { buildWhatsAppLink } from '@/lib/whatsapp'

export function FloatingWhatsApp({ whatsapp }: { whatsapp?: string | null }) {
  if (!whatsapp) return null
  const wa = buildWhatsAppLink(whatsapp, 'Olá! Vim pelo site e gostaria de mais informações.')

  return (
    <motion.a
      href={wa}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 ring-4 ring-[#25D366]/20"
    >
      <WhatsAppIcon className="size-7" />
    </motion.a>
  )
}
