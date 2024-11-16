import { create } from 'zustand';
import { useOpenAIAuth } from './openAIAuthStore';
import { TopicTree, GenerateOptions } from '../types/openai';
import { getMindMapPrompt } from '../utils/prompts/mindMapPrompts';

interface OpenAIStore {
  apiKey: string | null;
  generateSubTopics: (topic: string, options?: GenerateOptions) => Promise<TopicTree>;
}

export const useOpenAI = create<OpenAIStore>(() => ({
  apiKey: null,
  generateSubTopics: async (topic: string, options?: GenerateOptions) => {
    const { openai } = useOpenAIAuth.getState();
    if (!openai) throw new Error('OpenAI API key not set');

    try {
      const prompt = getMindMapPrompt(topic, options?.mode, options);

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "あなたはマインドマップ作成を支援するAIアシスタントです。与えられたトピックについて、階層的な構造を持つサブトピックを生成します。各トピックには詳細な説明を含めてください。必ず指定されたJSON形式で応答してください。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated');
      }

      try {
        const parsedContent = JSON.parse(content);
        
        if (!parsedContent.label || !Array.isArray(parsedContent.children)) {
          throw new Error('Invalid response structure');
        }

        return parsedContent;
      } catch (e) {
        console.error('Failed to parse response:', content);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating topics:', error);
      throw error;
    }
  },
}));