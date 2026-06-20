import { notFound } from 'next/navigation'

/**
 * Captura qualquer URL não correspondida dentro do site público e renderiza
 * o 404 branded (src/app/(frontend)/not-found.tsx) dentro do layout do site.
 * Rotas específicas (/imoveis, /contato, /admin, /api...) têm prioridade sobre este catch-all.
 */
export default function CatchAllNotFound() {
  notFound()
}
