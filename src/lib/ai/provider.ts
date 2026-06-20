import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { LanguageModel } from 'ai'

/**
 * Camada de provider agnóstica para o chat de IA.
 *
 * Escolha por variável de ambiente `AI_PROVIDER`:
 *  - "google"            → Gemini nativo (@ai-sdk/google). Free tier do Google AI Studio.
 *  - "openai-compatible" → qualquer endpoint no padrão OpenAI (OpenRouter, OpenAI, etc.).
 *
 * Trocar de provedor = mudar apenas as variáveis de ambiente, sem alterar código.
 */
const AI_PROVIDER = (process.env.AI_PROVIDER || 'openai-compatible').toLowerCase()

export const aiModel = (): LanguageModel => {
  if (AI_PROVIDER === 'google' || AI_PROVIDER === 'gemini') {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.AI_API_KEY || '',
    })
    return google(process.env.AI_MODEL || 'gemini-2.0-flash')
  }

  const openaiCompatible = createOpenAICompatible({
    name: 'broker-ai',
    baseURL: process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1',
    apiKey: process.env.AI_API_KEY || '',
  })
  return openaiCompatible(process.env.AI_MODEL || 'openai/gpt-4o-mini')
}

export const aiConfigured = () => Boolean(process.env.AI_API_KEY)
