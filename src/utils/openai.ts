import { create } from 'zustand';
import { TopicTree, GenerateOptions, OpenAIStore } from '../types/openai';
import { getMindMapPrompt } from './prompts/mindMapPrompts';
import { useMindMapStore } from '../store/mindMapStore';
import { useApiKeyStore } from '../store/apiKeyStore';
import { generateWithOpenAI, generateCodeWithOpenAI } from './api/openaiApi';
import { generateWithGemini } from './api/geminiApi';

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

      if (modelConfig.type.includes('GEMINI')) {
        if (!geminiKey) throw new Error('Gemini API key not found');
        const content = await generateWithGemini(geminiKey, prompt);
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

      if (!openaiKey) throw new Error('OpenAI API key not found');
      return await generateWithOpenAI(openaiKey, prompt, modelConfig.type);

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

    try {
      if (modelConfig.type.includes('GEMINI')) {
        if (!geminiKey) throw new Error('Gemini API key not found');
        const content = await generateWithGemini(geminiKey, prompt);
        const cleanedContent = content
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .replace(/^[\s\n]*/, '')
          .replace(/[\s\n]*$/, '')
          .trim();

        return JSON.parse(cleanedContent);
      }

      if (!openaiKey) throw new Error('OpenAI API key not found');
      return await generateCodeWithOpenAI(openaiKey, prompt);

    } catch (error) {
      console.error('Error generating code:', error);
      throw error;
    }
  }
}));

export type { TopicTree, GenerateOptions };