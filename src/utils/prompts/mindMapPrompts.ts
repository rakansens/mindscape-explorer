import { GenerateOptions } from '../../types/openai';

export const getMindMapPrompt = (topic: string, mode?: string, options?: GenerateOptions): string => {
  if (mode === 'how') {
    return `
以下のトピックについて、「どのように実現するか？」という視点からタスクリストを生成してください。

トピック: "${topic}"

要件:
1. 3つの主要なアプローチを提案してください
2. 各アプローチに対して2つの具体的なタスクを含めてください
3. アプローチは2-3行程度の簡潔な文章で記述してください
4. タスクも2-3行程度の簡潔な文章で記述してください

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "アプローチ1の内容を2-3行で記述",
      "children": [
        {
          "label": "タスク1-1の内容を2-3行で記述",
          "children": []
        },
        {
          "label": "タスク1-2の内容を2-3行で記述",
          "children": []
        }
      ]
    }
  ]
}`;
  }

  if (mode === 'quick') {
    return `
以下のトピックについて、サブトピックを3つ生成してください。

トピック: "${topic}"

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "サブトピック1",
      "children": []
    },
    {
      "label": "サブトピック2",
      "children": []
    },
    {
      "label": "サブトピック3",
      "children": []
    }
  ]
}`;
  }

  if (mode === 'detailed') {
    return `
以下のトピックについて、サブトピックとそれに関連する詳細を提供してください。

トピック: "${topic}"

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "サブトピック1",
      "description": "詳細1",
      "children": []
    },
    {
      "label": "サブトピック2",
      "description": "詳細2",
      "children": []
    }
  ]
}`;
  }

  if (mode === 'why') {
    return `
以下のトピックについて、なぜそれが重要かの理由を提供してください。

トピック: "${topic}"

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "理由1",
      "children": []
    },
    {
      "label": "理由2",
      "children": []
    }
  ]
}`;
  }

  // Default case (if mode is not recognized)
  return `
以下のトピックについて、サブトピックを生成してください。

トピック: "${topic}"

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": []
}`;
};
