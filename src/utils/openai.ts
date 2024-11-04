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
      const systemPrompt = `You are an AI assistant that generates mind map topics. Always respond with valid JSON in the following format:
{
  "label": "Main Topic",
  "children": [
    {
      "label": "Subtopic 1",
      "children": [
        {
          "label": "Detail 1.1",
          "children": []
        }
      ]
    }
  ]
}`;

      const userPrompt = `Generate a mind map structure for: "${prompt}"
Rules:
- Response must be valid JSON
- Use the exact format shown
- Generate 3-5 subtopics
- Each subtopic should have 2-3 child topics
- Keep labels concise and clear
- Ensure all "children" arrays exist (empty array if no children)`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
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