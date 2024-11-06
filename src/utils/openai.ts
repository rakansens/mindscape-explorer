import { useOpenAIAuth } from '../store/openAIAuthStore';
import { TopicTree, GenerateOptions } from '../types/openai';
import { getMindMapPrompt } from './prompts/mindMapPrompts';

const getMaxTokens = (model: string) => {
  switch (model) {
    case 'gpt-4-turbo-preview':
      return 4096;
    case 'gpt-4':
      return 4000;
    case 'gpt-3.5-turbo':
    default:
      return 2000;
  }
};

const SYSTEM_PROMPT = `あなたはマインドマップ作成を支援するAIアシスタントです。
与えられたトピックについて、階層的な構造を持つサブトピックを生成します。

応答は必ず以下のJSON形式で返してください：
{
  "label": "メインテーマ",
  "children": [
    {
      "label": "サブトピック",
      "description": "説明文（オプション）",
      "children": []
    }
  ]
}

重要な規則：
1. 応答は必ず有効なJSONオブジェクトである
2. 各ノードは必ずlabelプロパティを持つ
3. 各ノードは必ずchildren配列を持つ（空の場合は[]）
4. descriptionプロパティは任意
5. 上記以外のプロパティは使用しない

この形式を厳密に守ってください。`;

export const useOpenAI = () => {
  const { apiKey, openai, model } = useOpenAIAuth();

  const parseResponse = (content: string): TopicTree => {
    try {
      // コンテンツから有効なJSONを抽出
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      
      // JSONパース
      const parsed = JSON.parse(jsonContent);
      
      // 基本的な構造チェック
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Response is not an object');
      }

      // labelがない場合は探してみる
      if (!parsed.label && parsed.topic) {
        parsed.label = parsed.topic;
      }

      if (!parsed.label) {
        throw new Error('No label found in response');
      }

      // childrenがない場合は空配列を設定
      if (!Array.isArray(parsed.children)) {
        parsed.children = [];
      }

      // 各子要素を正規化
      const normalizeNode = (node: any): TopicTree => {
        if (typeof node === 'string') {
          return { label: node, children: [] };
        }
        return {
          label: node.label || node.topic || 'Untitled',
          description: node.description,
          children: Array.isArray(node.children)
            ? node.children.map(normalizeNode)
            : []
        };
      };

      return {
        label: parsed.label,
        description: parsed.description,
        children: parsed.children.map(normalizeNode)
      };

    } catch (e) {
      console.error('JSON Parse Error:', e);
      console.log('Raw Content:', content);
      throw new Error('Failed to parse AI response');
    }
  };

  const generateSubTopics = async (topic: string, options?: GenerateOptions): Promise<TopicTree> => {
    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const prompt = getMindMapPrompt(topic, options?.mode, options);

      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: getMaxTokens(model),
        response_format: model === 'gpt-4-turbo-preview' ? { type: "json_object" } : undefined,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated');
      }

      // 応答を解析して正規化
      return parseResponse(content);

    } catch (error) {
      console.error('Error generating topics:', error);
      if (error instanceof Error) {
        throw new Error(`OpenAI API Error: ${error.message}`);
      }
      throw error;
    }
  };

  return {
    generateSubTopics,
    apiKey
  };
};

export type { TopicTree, GenerateOptions };