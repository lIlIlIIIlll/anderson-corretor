/* eslint-disable @typescript-eslint/no-explicit-any */

/** Extrai texto puro de um valor richText (Lexical) — útil para meta descriptions. */
export function lexicalToPlainText(data: any): string {
  if (!data?.root?.children) return ''
  const walk = (nodes: any[]): string =>
    nodes
      .map((n) => {
        if (n?.type === 'text') return n.text || ''
        if (Array.isArray(n?.children)) return walk(n.children)
        return ''
      })
      .join(' ')
  return walk(data.root.children).replace(/\s+/g, ' ').trim()
}

/** Trunca um texto em um limite de caracteres, sem cortar no meio de palavra. */
export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text
  return text.slice(0, text.lastIndexOf(' ', max)).trim() + '…'
}
