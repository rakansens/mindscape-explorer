import OpenAI from 'openai';
import { TopicTree } from '../../types/openai';
import { useToast } from '../../hooks/use-toast';

const validateApiKey = (apiKey: string | null) => {
  if (!apiKey) {
    throw new Error('APIキーが設定されていません。APIキーを設定してください。');
  }
  if (typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new Error('無効なAPIキーです。正しいAPIキーを設定してください。');
  }
};

export const generateWithOpenAI = async (
  apiKey: string,
  prompt: string,
  modelType: string
): Promise<TopicTree> => {
  try {
    validateApiKey(apiKey);

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
    if (!content) throw new Error('コンテンツが生成されませんでした');

    return JSON.parse(content);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('OpenAI APIへの接続に失敗しました。インターネット接続とAPIキーを確認してください。');
      }
      throw error;
    }
    throw new Error('予期せぬエラーが発生しました');
  }
};

export const generateCodeWithOpenAI = async (
  apiKey: string,
  prompt: string
): Promise<{ html?: string; css?: string; javascript?: string }> => {
  try {
    validateApiKey(apiKey);

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
    if (!content) throw new Error('コンテンツが生成されませんでした');

    return JSON.parse(content);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('OpenAI APIへの接続に失敗しました。インターネット接続とAPIキーを確認してください。');
      }
      throw error;
    }
    throw new Error('予期せぬエラーが発生しました');
  }
};