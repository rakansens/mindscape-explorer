import OpenAI from 'openai';
import { TopicTree } from '../../types/openai';

export const generateWithOpenAI = async (
  apiKey: string,
  prompt: string,
  modelType: string
): Promise<TopicTree> => {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  const openaiModel = (() => {
    switch (modelType) {
      case 'GPT4':
        return 'gpt-4';
      case 'GPT4-Turbo':
        return 'gpt-4-turbo-preview';
      case 'GPT3.5':
      default:
        return 'gpt-3.5-turbo';
    }
  })();

  const response = await openai.chat.completions.create({
    model: openaiModel,
    messages: [
      {
        role: "system",
        content: "あなたはマインドマップ作成を支援するAIアシスタントです。与えられたトピックについて、階層的な構造を持つサブトピックを生成します。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No content generated');

  return JSON.parse(content);
};

export const generateCodeWithOpenAI = async (
  apiKey: string,
  prompt: string
): Promise<{ html?: string; css?: string; javascript?: string }> => {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: "system",
        content: "あなたはコード生成を支援するAIアシスタントです。与えられたトピックに関連するコードを生成します。必ず有効なJSONを返してください。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No content generated');

  return JSON.parse(content);
};