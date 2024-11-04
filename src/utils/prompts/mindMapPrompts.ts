import { GenerateOptions } from '../../types/openai';

export const getMindMapPrompt = (topic: string, mode?: string, options?: GenerateOptions): string => {
  if (mode === 'how') {
    return `
以下のトピックについて、「どのように実現するか？」という視点からタスクリストを生成してください。

トピック: "${topic}"

要件:
1. 3-5個の主要なアプローチを提案してください
2. 各アプローチに対して2-3個の具体的なタスクを含めてください
3. タスクは実行可能な粒度まで分解してください
4. 各タスクには簡潔な説明を含めてください

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "アプローチ1",
      "description": "アプローチ1の説明",
      "children": [
        {
          "label": "タスク1-1",
          "description": "タスク1-1の説明",
          "children": []
        }
      ]
    }
  ]
}`;
  }

  if (mode === 'quick') {
    const structure = options?.structure || {
      level1: 3,
      level2: 2,
      level3: 1
    };

    return `
以下のトピックについて、階層的な構造でサブトピックを生成してください。

トピック: "${topic}"

要件:
1. 最上位レベルに${structure.level1}個の主要なサブトピック
2. 各主要サブトピックに${structure.level2}個ずつの子トピック
3. 各子トピックに${structure.level3}個ずつの孫トピック

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "主要サブトピック1",
      "children": [
        {
          "label": "子トピック1-1",
          "children": [
            {
              "label": "孫トピック1-1-1",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}`;
  }

  if (mode === 'detailed') {
    return `
以下のトピックについて、サブトピックとそれに関連する詳細な説明を提供してください。

トピック: "${topic}"
${options?.nodeContext ? `\n現在のコンテキスト: ${options.nodeContext}` : ''}

要件:
1. 3-5個の重要なサブトピックを生成
2. 各サブトピックに詳細な説明（2-3文程度）を含める
3. 説明は具体的で実用的な内容にする

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "サブトピック1",
      "description": "詳細な説明1",
      "children": []
    }
  ]
}`;
  }

  if (mode === 'why') {
    return `
以下のトピックについて、「なぜそれが重要か」という観点から分析してください。

トピック: "${topic}"

要件:
1. 3-5個の「なぜ？」という質問を生成
2. 各質問に対して詳細な説明（2-3文程度）を提供
3. 説明は論理的で説得力のある内容にする

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "なぜ質問1？",
      "children": [
        {
          "label": "説明1",
          "description": "詳細な説明文1",
          "children": []
        }
      ]
    }
  ]
}`;
  }

  // Default case
  return `
以下のトピックについて、サブトピックを生成してください。

トピック: "${topic}"

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "サブトピック1",
      "children": []
    }
  ]
}`;
};