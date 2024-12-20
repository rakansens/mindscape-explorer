import { create } from 'zustand';
import { TopicTree, GenerateOptions } from '../types/openai';
import { getMindMapPrompt } from '../utils/prompts/mindMapPrompts';
import { useMindMapStore } from './mindMapStore';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface OpenAIStore {
  apiKey: string | null;
  geminiKey: string | null;
  setApiKey: (key: string) => void;
  setGeminiKey: (key: string) => void;
  generateSubTopics: (topic: string, options?: GenerateOptions) => Promise<TopicTree>;
}

export const useOpenAI = create<OpenAIStore>((set) => ({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || null,
  geminiKey: import.meta.env.VITE_GEMINI_API_KEY || null,
  setApiKey: (key: string) => set({ apiKey: key }),
  setGeminiKey: (key: string) => set({ geminiKey: key }),
  generateSubTopics: async (topic: string, options?: GenerateOptions) => {
    const { modelConfig } = useMindMapStore.getState();
    if (!modelConfig) throw new Error('Model configuration not set');

    try {
      const prompt = getMindMapPrompt(topic, options?.mode, options);

      // Geminiモデルの場合
      if (modelConfig.type.includes('GEMINI')) {
        const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!geminiKey) throw new Error('Gemini API key not found');

        const genAI = new GoogleGenerativeAI(geminiKey);
        const modelName = modelConfig.type === 'GEMINI-PRO-VISION' 
          ? 'gemini-pro-vision'
          : 'gemini-pro';

        const model = genAI.getGenerativeModel({ model: modelName });
        const geminiPrompt = `
あなたはJSON形式でマインドマップのデータを生成するAIです。
以下のトピックに関連するマインドマップを生成してください。

トピック: "${topic}"

応答は必ず以下の形式の有効なJSONのみを返してください：

{
  "label": "${topic}",
  "children": [
    {
      "label": "サブトピック1の例",
      "description": "このサブトピックの説明",
      "children": []
    }
  ]
}
`;

        const result = await model.generateContent(geminiPrompt);
        const response = await result.response;
        const content = response.text();

        const cleanedContent = content
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .replace(/^[\s\n]*/, '')
          .replace(/[\s\n]*$/, '')
          .trim();

        const parsedContent = JSON.parse(cleanedContent);
        
        if (!parsedContent.label || !Array.isArray(parsedContent.children)) {
          throw new Error('Invalid response structure from Gemini');
        }

        return parsedContent;
      }

      // OpenAIモデルの場合
      const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!openaiKey) throw new Error('OpenAI API key not found');

      const openai = new OpenAI({
        apiKey: openaiKey,
        dangerouslyAllowBrowser: true,
        baseURL: 'https://api.openai.com/v1' // Explicitly set the base URL
      });

      const openaiModel = (() => {
        switch (modelConfig.type) {
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
    } catch (error) {
      console.error('Error generating topics:', error);
      throw error;
    }
  }
}));

export type { TopicTree, GenerateOptions };