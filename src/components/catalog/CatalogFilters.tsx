'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ALL = '_all'

export function CatalogFilters() {
  const router = useRouter()
  const sp = useSearchParams()

  const [tipo, setTipo] = useState(sp.get('tipo') ?? ALL)
  const [transacao, setTransacao] = useState(sp.get('transacao') ?? ALL)
  const [bairro, setBairro] = useState(sp.get('bairro') ?? '')
  const [quartos, setQuartos] = useState(sp.get('quartos') ?? ALL)
  const [precoMax, setPrecoMax] = useState(sp.get('precoMax') ?? '')

  const apply = (e?: React.FormEvent) => {
    e?.preventDefault()
    const params = new URLSearchParams()
    if (tipo !== ALL) params.set('tipo', tipo)
    if (transacao !== ALL) params.set('transacao', transacao)
    if (bairro.trim()) params.set('bairro', bairro.trim())
    if (quartos !== ALL) params.set('quartos', quartos)
    if (precoMax.trim()) params.set('precoMax', precoMax.trim())
    const qs = params.toString()
    router.push(qs ? `/imoveis?${qs}` : '/imoveis')
  }

  const clear = () => {
    setTipo(ALL)
    setTransacao(ALL)
    setBairro('')
    setQuartos(ALL)
    setPrecoMax('')
    router.push('/imoveis')
  }

  const hasFilters =
    tipo !== ALL || transacao !== ALL || bairro.trim() || quartos !== ALL || precoMax.trim()

  return (
    <form
      onSubmit={apply}
      className="rounded-xl border border-border/70 bg-card p-5 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Tipo</Label>
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos</SelectItem>
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Transação</Label>
          <Select value={transacao} onValueChange={setTransacao}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas</SelectItem>
              <SelectItem value="venda">Venda</SelectItem>
              <SelectItem value="aluguel">Aluguel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Bairro</Label>
          <Input
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Ex.: Centro"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Quartos (mín.)</Label>
          <Select value={quartos} onValueChange={setQuartos}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Qualquer</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Preço máx. (R$)</Label>
          <Input
            value={precoMax}
            onChange={(e) => setPrecoMax(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            placeholder="Ex.: 500000"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button type="submit">
          <Search className="size-4" /> Filtrar
        </Button>
        {hasFilters && (
          <Button type="button" variant="ghost" onClick={clear}>
            <X className="size-4" /> Limpar
          </Button>
        )}
      </div>
    </form>
  )
}
