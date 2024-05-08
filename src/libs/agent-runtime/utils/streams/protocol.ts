import OpenAI from 'openai';

interface StreamProtocolChunk {
  data: any;
  id: string;
  type: 'text' | 'tool_calls' | 'data' | 'stop';
}

export const transformOpenAIStream = (chunk: OpenAI.ChatCompletionChunk): StreamProtocolChunk => {
  // maybe need another structure to add support for multiple choices
  const item = chunk.choices[0];

  if (typeof item.delta?.content === 'string') {
    return { data: item.delta.content, id: chunk.id, type: 'text' };
  }

  if (item.delta?.tool_calls) {
    return { data: item.delta.tool_calls, id: chunk.id, type: 'tool_calls' };
  }

  // 给定结束原因
  if (item.finish_reason) {
    return { data: item.finish_reason, id: chunk.id, type: 'stop' };
  }

  if (item.delta.content === null) {
    return { data: item.delta, id: chunk.id, type: 'data' };
  }

  // 其余情况下，返回 delta 和 index
  return {
    data: { delta: item.delta, id: chunk.id, index: item.index },
    id: chunk.id,
    type: 'data',
  };
};
