import { GenerateOptions } from '../../types/openai';

export const getMindMapPrompt = (topic: string, mode?: string, options?: GenerateOptions): string => {
  if (mode === 'ideas') {
    return `
以下のトピックについて、10個のユニークなアイディアを生成してください。

トピック: "${topic}"

要件:
1. 各アイディアは2-3行の文章で具体的に説明してください
2. 実現可能で実用的なアイディアを提案してください
3. 多様な視点からアイディアを生成してください
4. 各アイディアは独立していて、重複がないようにしてください

応答は以下のようなJSON形式で返してください:
{
  "label": "${topic}",
  "children": [
    {
      "label": "アイディア1の内容を2-3行で記述",
      "children": []
    },
    {
      "label": "アイディア2の内容を2-3行で記述",
      "children": []
    },
    {
      "label": "アイディア3の内容を2-3行で記述",
      "children": []
    },
    {
      "label": "アイディア4の内容を2-3行で記述",
      "children": []
    },
    {
      "label": "アイディア5の内容を2-3行で記述",
      "children": []
    },
    {
      "label": "アイディア6の内容を2-3行で記述",
      "children": []
    },
    {
      "label": "アイディア7の内容を2-3行で記述",
      "children": []
    },
    {
      "label": "アイディア8の内容を2-3行で記述",
      "children": []
    },
    {
      "label": "アイディア9の内容を2-3行で記述",
      "children": []
    },
    {
      "label": "アイディア10の内容を2-3行で記述",
      "children": []
    }
  ]
}`;
  }

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
以下のトピックについて、階層的な構造でサブトピックを生成してください。

トピック: "${topic}"

要件:
1. 最上位レベルに3つの主要なサブトピック
2. 各主要サブトピックに2つずつの子トピック
3. 各子トピックに1つずつの孫トピック

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
以下のトピックについて、「なぜそれが重要か」という観点から3つの質問とその答えを生成してください。

トピック: "${topic}"

要件:
1. 3つの「なぜ？」という質問を生成してください
2. 各質問に対して詳細な説明を提供してください
3. 質問は子ノードとして、説明は孫ノードとして表示されます

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
