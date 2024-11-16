import { create } from 'zustand';
import { TopicTree, GenerateOptions } from '../types/openai';
import { getMindMapPrompt } from '../utils/prompts/mindMapPrompts';

interface OpenAIStore {
  apiKey: string | null;
  generateSubTopics: (topic: string, options?: GenerateOptions) => Promise<TopicTree>;
}

export const useOpenAI = create<OpenAIStore>(() => ({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || null,
  generateSubTopics: async (topic: string, options?: GenerateOptions) => {
    const { modelConfig } = useMindMapStore.getState();
    if (!modelConfig) throw new Error('Model configuration not set');

    try {
      const prompt = getMindMapPrompt(topic, options?.mode, options);

      // Geminiモデルの場合
      if (modelConfig.type.includes('GEMINI')) {
        console.log('=== Starting Gemini API Call ===');
        console.log('Current Model Config:', {
          type: modelConfig.type,
          hasGeminiKey: !!modelConfig.geminiKey
        });
        
        const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
        console.log('Gemini API Key Status:', geminiKey ? 'Available' : 'Missing');
        
        if (!geminiKey) throw new Error('Gemini API key not found');

        const genAI = new GoogleGenerativeAI(geminiKey);
        const modelName = modelConfig.type === 'GEMINI-PRO-VISION' 
          ? 'gemini-pro-vision'
          : 'gemini-pro';
        
        console.log('Selected Gemini Model:', modelName);

        const model = genAI.getGenerativeModel({ model: modelName });

        // Gemini用のプロンプトをより具体的に
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
    },
    {
      "label": "サブトピック2の例",
      "description": "このサブトピックの説明",
      "children": [
        {
          "label": "サブサブトピックの例",
          "description": "説明",
          "children": []
        }
      ]
    }
  ]
}

重要な注意事項：
1. 応答は上記のJSON形式のみとし、他の説明文は一切含めないでください
2. JSON形式は厳密に守り、すべてのキーをダブルクォートで囲んでください
3. 各ノードには必ず "label" と "children" を含めてください
4. "description" は任意です
5. コードブロックは使用せず、純粋なJSONのみを返してください
`;

        const result = await model.generateContent(geminiPrompt);
        const response = await result.response;
        const content = response.text();

        console.log('=== Gemini API Response Received ===');
        console.log('Raw Response:', content.substring(0, 200) + '...');  // 長すぎる場合は省略

        try {
          // レスポンスのクリーンアップ
          const cleanedContent = content
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .replace(/^[\s\n]*/, '')  // 先頭の空白と改行を削除
            .replace(/[\s\n]*$/, '')  // 末尾の空白と改行を削除
            .trim();

          console.log('Cleaned Gemini response:', cleanedContent);  // デバッグ用

          const parsedContent = JSON.parse(cleanedContent);
          
          // 応答の構造を検証
          if (!parsedContent.label || !Array.isArray(parsedContent.children)) {
            console.error('Invalid response structure:', parsedContent);
            throw new Error('Invalid response structure from Gemini');
          }

          return parsedContent;
        } catch (e) {
          console.error('Failed to parse Gemini response:', e);
          throw new Error('Invalid JSON format from Gemini. Please try again.');
        }
      }

      // OpenAIモデルの場合
      const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!openaiKey) throw new Error('OpenAI API key not found');

      const openai = new OpenAI({
        apiKey: openaiKey,
        dangerouslyAllowBrowser: true
      });

      // モデルタイプに応じて適切なOpenAIモデルを選択
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

      console.log('Using OpenAI model:', openaiModel);

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
