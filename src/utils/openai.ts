import { useOpenAIAuth } from '../store/openAIAuthStore';
import { TopicTree, GenerateOptions } from '../types/openai';
import { getMindMapPrompt } from './prompts/mindMapPrompts';

export const useOpenAI = () => {
  const { apiKey, openai } = useOpenAIAuth();

  const generateSubTopics = async (prompt: string, options?: GenerateOptions): Promise<TopicTree> => {
    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const mindMapPrompt = getMindMapPrompt(prompt, options?.mode, options);

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "あなたはマインドマップ作成を支援するAIアシスタントです。与えられたトピックについて、階層的な構造を持つサブトピックを生成します。必ず指定されたJSON形式で応答してください。"
          },
          {
            role: "user",
            content: mindMapPrompt
          }
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No content generated');

      try {
        const parsedContent = JSON.parse(content);
        return parsedContent;
      } catch (e) {
        console.error('Failed to parse response:', content);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating topics:', error);
      throw error;
    }
  };

  return {
    generateSubTopics,
    apiKey
  };
};