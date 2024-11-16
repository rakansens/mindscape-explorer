import { create } from 'zustand';
import { TopicTree, GenerateOptions } from '../types/openai';
import { getMindMapPrompt } from './prompts/mindMapPrompts';
import { useMindMapStore } from '../store/mindMapStore';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useApiKeyStore } from '../store/apiKeyStore';

// Add the missing generateWithAI function
export const generateWithAI = async (prompt: string) => {
  const { openaiKey } = useApiKeyStore.getState();
  
  if (!openaiKey) {
    throw new Error('OpenAI API key not found');
  }

  const openai = new OpenAI({
    apiKey: openaiKey,
    dangerouslyAllowBrowser: true
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that generates code based on descriptions."
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

  return content;
};

interface OpenAIStore {
  apiKey: string | null;
  geminiKey: string | null;
  setApiKey: (key: string) => void;
  setGeminiKey: (key: string) => void;
  generateSubTopics: (topic: string, options?: GenerateOptions) => Promise<TopicTree>;
  generateCode: (nodeId: string) => Promise<{ html?: string; css?: string; javascript?: string }>;
}

export const useOpenAI = create<OpenAIStore>((set) => ({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || null,
  geminiKey: import.meta.env.VITE_GEMINI_API_KEY || null,
  setApiKey: (key: string) => set({ apiKey: key }),
  setGeminiKey: (key: string) => set({ geminiKey: key }),
  generateSubTopics: async (topic: string, options?: GenerateOptions) => {
    const { modelConfig } = useMindMapStore.getState();
    const { openaiKey, geminiKey } = useApiKeyStore.getState();

    if (!modelConfig) throw new Error('Model configuration not set');

    try {
      const prompt = getMindMapPrompt(topic, options?.mode, options);

      // Geminiモデルの場合
      if (modelConfig.type.includes('GEMINI')) {
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
}`;

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
      if (!openaiKey) throw new Error('OpenAI API key not found');

      const openai = new OpenAI({
        apiKey: openaiKey,
        dangerouslyAllowBrowser: true
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
  },

  generateCode: async (nodeId: string) => {
    const { nodes } = useMindMapStore.getState();
    const { openaiKey, geminiKey } = useApiKeyStore.getState();
    const { modelConfig } = useMindMapStore.getState();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) throw new Error('Node not found');

    if (!modelConfig) throw new Error('Model configuration not set');

    try {
      const prompt = `
以下のトピックに関連するコードを生成してください。
シンプルで実用的なコードを生成してください。

トピック: "${node.data.label}"

以下の形式でJSONを返してください：

{
  "html": "HTMLコード",
  "css": "CSSコード",
  "javascript": "JavaScriptコード"
}`;

      // Geminiモデルの場合
      if (modelConfig.type.includes('GEMINI')) {
        if (!geminiKey) throw new Error('Gemini API key not found');

        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();

        const cleanedContent = content
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .replace(/^[\s\n]*/, '')
          .replace(/[\s\n]*$/, '')
          .trim();

        return JSON.parse(cleanedContent);
      }

      // OpenAIモデルの場合
      if (!openaiKey) throw new Error('OpenAI API key not found');

      const openai = new OpenAI({
        apiKey: openaiKey,
        dangerouslyAllowBrowser: true
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
            content: "あなたはコード生成を支援するAIアシスタントです。与えられたトピックに関連するコードを生成します。"
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
      console.error('Error generating code:', error);
      throw error;
    }
  }
}));