import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

/**
 * Provider agnóstico no padrão OpenAI-compatible (OpenRouter por padrão).
 * Trocar de provedor = mudar apenas AI_BASE_URL / AI_API_KEY / AI_MODEL no .env.
 */
const provider = createOpenAICompatible({
  name: 'broker-ai',
  baseURL: process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.AI_API_KEY || '',
})

export const aiModel = () => provider(process.env.AI_MODEL || 'openai/gpt-4o-mini')

export const aiConfigured = () => Boolean(process.env.AI_API_KEY)
