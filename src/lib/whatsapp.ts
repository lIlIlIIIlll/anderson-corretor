/** Monta um link wa.me a partir de um telefone (qualquer formato) e mensagem opcional. */
export const buildWhatsAppLink = (phone?: string | null, message?: string): string => {
  const digits = (phone || '').replace(/\D/g, '')
  const base = `https://wa.me/${digits}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
