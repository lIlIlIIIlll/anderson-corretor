'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Markdown } from './Markdown'
import { cn } from '@/lib/utils'

function Bubble({ role, text }: { role: string; text: string }) {
  const isUser = role === 'user'
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'whitespace-pre-wrap rounded-br-sm bg-primary text-primary-foreground'
            : 'rounded-bl-sm bg-secondary text-foreground',
        )}
      >
        {isUser ? text : <Markdown>{text}</Markdown>}
      </div>
    </div>
  )
}

export function ChatWidget({ welcomeMessage }: { welcomeMessage?: string | null }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  const busy = status === 'submitted' || status === 'streaming'
  const welcome =
    welcomeMessage ||
    'Olá! 👋 Me conte o que você procura (tipo, bairro, faixa de preço) que eu te mostro as melhores opções.'

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, status])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    sendMessage({ text })
    setInput('')
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-black/20"
          >
            <Sparkles className="size-5" />
            <span className="hidden sm:inline">Assistente IA</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-6 left-6 z-50 flex h-[min(600px,calc(100vh-3rem))] w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-full bg-white/15">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Assistente Virtual</p>
                  <p className="text-xs text-primary-foreground/70">Encontre seu imóvel ideal</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="opacity-80 transition hover:opacity-100">
                <X className="size-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              <Bubble role="assistant" text={welcome} />
              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === 'text' ? p.text : ''))
                  .join('')
                if (!text) return null
                return <Bubble key={m.id} role={m.role} text={text} />
              })}
              {busy && (
                <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> digitando…
                </div>
              )}
              {error && (
                <p className="px-1 text-sm text-destructive">
                  Ops, tive um problema para responder. Tente novamente em instantes.
                </p>
              )}
            </div>

            <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem…"
                className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" size="icon" className="rounded-full" disabled={busy || !input.trim()}>
                <Send className="size-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
