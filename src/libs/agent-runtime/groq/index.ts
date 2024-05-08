import { AgentRuntimeErrorType } from '../error';
import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeGroq = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.groq.com/openai/v1',
  chatCompletion: {
    handlePayload: (payload) => {
      return {
        ...payload,
        // disable stream for tools due to groq dont support
        stream: !payload.tools,
      } as any;
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_GROQ_CHAT_COMPLETION === '1',
  },
  errorType: {
    bizError: AgentRuntimeErrorType.GroqBizError,
    invalidAPIKey: AgentRuntimeErrorType.InvalidGroqAPIKey,
  },
  provider: ModelProvider.Groq,
});
