import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from 'ai'
import { aiModel, aiConfigured } from '@/lib/ai/provider'
import { SYSTEM_PROMPT } from '@/lib/ai/systemPrompt'
import { searchProperties, captureLead } from '@/lib/ai/tools'

export const maxDuration = 30

export async function POST(req: Request) {
  if (!aiConfigured()) {
    return Response.json(
      { error: 'O assistente de IA ainda não foi configurado. Defina AI_API_KEY no ambiente.' },
      { status: 503 },
    )
  }

  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: aiModel(),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: { searchProperties, captureLead },
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse()
}
