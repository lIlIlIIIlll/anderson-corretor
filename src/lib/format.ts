export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  terreno: 'Terreno',
  comercial: 'Comercial',
}

export const TRANSACTION_LABELS: Record<string, string> = {
  venda: 'Venda',
  aluguel: 'Aluguel',
}

export const STATUS_LABELS: Record<string, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  vendido: 'Vendido',
}

export const AMENITY_LABELS: Record<string, string> = {
  piscina: 'Piscina',
  churrasqueira: 'Churrasqueira',
  academia: 'Academia',
  portaria24h: 'Portaria 24h',
  elevador: 'Elevador',
  varanda: 'Varanda',
  mobiliado: 'Mobiliado',
  petfriendly: 'Aceita pet',
  lazer: 'Área de lazer',
  condominiofechado: 'Condomínio fechado',
}

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

export const formatPrice = (
  price: number | null | undefined,
  opts: { transaction?: string | null; priceOnRequest?: boolean | null } = {},
): string => {
  if (opts.priceOnRequest || price == null) return 'Sob consulta'
  const formatted = brl.format(price)
  return opts.transaction === 'aluguel' ? `${formatted}/mês` : formatted
}

export const formatArea = (area: number | null | undefined): string | null =>
  area == null ? null : `${new Intl.NumberFormat('pt-BR').format(area)} m²`
