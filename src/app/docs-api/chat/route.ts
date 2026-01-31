import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { convertToModelMessages, streamText } from 'ai';
import { ProvideLinksToolSchema } from '../../../lib/inkeep-qa-schema';

export const runtime = 'edge';

const openai = createOpenAICompatible({
  name: 'groqcloud',
  apiKey: process.env.GROQ_CLOUD_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  return new Response(JSON.stringify({ message: 'Coming soon!' }));

  /**
  const reqJson = await req.json();

  const result = streamText({
    model: openai('moonshotai/kimi-k2-instruct-0905'),
    tools: {
      provideLinks: {
        inputSchema: ProvideLinksToolSchema,
      },
    },
    messages: await convertToModelMessages(reqJson.messages, {
      ignoreIncompleteToolCalls: true,
    }),
    toolChoice: 'auto',
  });

  return result.toUIMessageStreamResponse();
  **/
}
