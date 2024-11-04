import { useOpenAIAuth } from '../store/openAIAuthStore';

export interface TopicTree {
  label: string;
  children?: TopicTree[];
}

interface GenerateOptions {
  mode: 'quick' | 'detailed';
  quickType?: 'simple' | 'complex';
}

export const useOpenAI = () => {
  const { apiKey, openai } = useOpenAIAuth();

  const generateSubTopics = async (prompt: string, options: GenerateOptions): Promise<TopicTree> => {
    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that generates mind map topics."
          },
          {
            role: "user",
            content: `Generate subtopics for: ${prompt}`
          }
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No content generated');

      try {
        return JSON.parse(content);
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