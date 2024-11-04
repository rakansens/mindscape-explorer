import { GenerateOptions } from '../../types/openai';

export const getMindMapPrompt = (topic: string, mode?: string, options?: GenerateOptions): string => {
  if (mode === 'how') {
    return `
以下のトピックについて、「どのように実現するか？」という視点からタスクリストを生成してください。

トピック: "${topic}"

要件:
1. 3つの主要なアプローチを提案してください
2. 各アプローチに対して2つの具体的なタスクを含めてください
3. アプローチには説明を含め、タスクには具体的な実行手順を含めてください

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "アプローチ1",
      "description": "このアプローチの説明（2-3行）",
      "children": [
        {
          "label": "タスク1-1",
          "description": "タスク1-1の具体的な実行手順（2-3行）",
          "children": []
        },
        {
          "label": "タスク1-2",
          "description": "タスク1-2の具体的な実行手順（2-3行）",
          "children": []
        }
      ]
    }
  ]
}`;
  }

  if (mode === 'why') {
    return `
以下のトピックについて、「なぜ？」という視点から分析を生成してください。

トピック: "${topic}"

要件:
1. 3つの本質的な「なぜ？」という質問を生成してください
2. 各質問に対して2つの具体的な回答を含めてください
3. 質問ノードには説明を含めず、回答ノードにのみ詳細な説明を含めてください

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "なぜ～？（質問1）",
      "children": [
        {
          "label": "回答1-1のタイトル",
          "description": "回答1-1の詳細な説明（3-4行程度）",
          "children": []
        },
        {
          "label": "回答1-2のタイトル",
          "description": "回答1-2の詳細な説明（3-4行程度）",
          "children": []
        }
      ]
    },
    {
      "label": "なぜ～？（質問2）",
      "children": [
        {
          "label": "回答2-1のタイトル",
          "description": "回答2-1の詳細な説明（3-4行程度）",
          "children": []
        },
        {
          "label": "回答2-2のタイトル",
          "description": "回答2-2の詳細な説明（3-4行程度）",
          "children": []
        }
      ]
    },
    {
      "label": "なぜ～？（質問3）",
      "children": [
        {
          "label": "回答3-1のタイトル",
          "description": "回答3-1の詳細な説明（3-4行程度）",
          "children": []
        },
        {
          "label": "回答3-2のタイトル",
          "description": "回答3-2の詳細な説明（3-4行程度）",
          "children": []
        }
      ]
    }
  ]
}`;
  }

  return `
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
};