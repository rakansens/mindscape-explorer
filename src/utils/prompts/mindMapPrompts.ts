import { GenerateOptions } from '../../types/openai';

const whyPrompt = `
以下のトピックについて、「なぜ？」という視点から簡潔な分析を生成してください。

トピック: "${topic}"

要件:
1. 3つの本質的な「なぜ？」という質問を生成
2. 各質問に対して2つの簡潔な回答（2-3行程度）を含める
3. 回答は具体的で分かりやすい表現を使用

応答は以下のような階層的なJSON形式にしてください:
{
  "label": "なぜ${topic}なのか？",
  "children": [
    {
      "label": "質問1：なぜ～なのか？",
      "children": [
        {
          "label": "回答1-1",
          "description": "【結論】\\n[簡潔な回答]\\n\\n【根拠】\\n[具体的な説明（2-3行）]",
          "children": []
        },
        {
          "label": "回答1-2",
          "description": "【結論】\\n[別の視点からの回答]\\n\\n【根拠】\\n[具体的な説明（2-3行）]",
          "children": []
        }
      ]
    }
  ]
}`;

export const getMindMapPrompt = (topic: string, mode?: string, options?: GenerateOptions): string => {
  if (mode === 'why') {
    return whyPrompt;
  }
  const defaultPrompt = `
以下のトピックについて、3階層の詳細なマインドマップを生成してください。必ず指定されたJSON形式で応答してください。

トピック: "${topic}"

要件:
1. 第1階層: 3-4個の主要カテゴリを生成
2. 第2階層: 各カテゴリに2-3個のサブトピックを生成
3. 第3階層: 各サブトピックに1-2個の具体的な項目を生成
4. シンプルで分かりやすい単語や短いフレーズを使用

応答は必ず以下のJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "カテゴリ1",
      "children": [
        {
          "label": "サブトピック1-1",
          "children": [
            {
              "label": "具体的な項目1-1-1",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

注意:
- 必ずJSON形式で応答してください
- childrenは必ず配列として返してください
- 末端ノードのchildrenは空配列[]としてください
`;

  return defaultPrompt;
};
