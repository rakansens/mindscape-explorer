import { create } from 'zustand';
import { useOpenAIAuth } from './openAIAuthStore';
import { TopicTree, GenerateOptions } from '../types/openai';

interface OpenAIStore {
  generateSubTopics: (topic: string, options?: GenerateOptions) => Promise<TopicTree>;
}

export const useOpenAI = create<OpenAIStore>(() => ({
  generateSubTopics: async (topic: string, options?: GenerateOptions) => {
    const { openai } = useOpenAIAuth.getState();
    if (!openai) throw new Error('OpenAI API key not set');

    try {
      const isHow = options?.mode === 'how';
      const isDetailed = options?.mode === 'detailed';
      const isDetailedHow = isHow && options?.howType === 'detailed';
      const isWhy = options?.mode === 'why';
      const isDetailedWhy = isWhy && options?.whyType === 'detailed';
      const isWhat = options?.mode === 'what';
      const isDetailedWhat = isWhat && options?.whatType === 'detailed';
      const isWhich = options?.mode === 'which';
      const isDetailedWhich = isWhich && options?.whichType === 'detailed';
      
      let prompt = '';

      if (isWhy) {
        prompt = isDetailedWhy ? `
以下のトピックについて、「なぜ？」という視点から階層的な分析を生成してください。

トピック: "${topic}"

要件:
1. 3つの主要な「なぜ」の視点を生成
2. 各視点に2-3個の具体的な理由を含める
3. 簡潔で分かりやすい説明を心がける
4. 論理的なつながりを意識する

応答は以下のような階層的なJSON形式にしてください:
{
  "label": "なぜ${topic}なのか？",
  "children": [
    {
      "label": "理由1",
      "children": [
        {
          "label": "具体的な説明1-1",
          "description": "詳細な説明...",
          "children": []
        }
      ]
    }
  ]
}` : `
以下のトピックについて、「なぜ？」という視点から階層的な分析を生成してください。

トピック: "${topic}"

要件:
1. 3つの主要な「なぜ」の視点を生成
2. 各視点に2-3個の具体的な理由を含める
3. 簡潔で分かりやすい説明を心がける

応答は以下のような階層的なJSON形式にしてください:
{
  "label": "なぜ${topic}なのか？",
  "children": [
    {
      "label": "理由1",
      "children": [
        {
          "label": "具体的な説明1-1",
          "children": []
        }
      ]
    }
  ]
}`;
      } else if (isHow) {
        prompt = isDetailedHow ? `
以下のトピックを達成するための詳細な手順を生成してください。

トピック: "${topic}"

要件:
1. 5-7個の具体的な手順を生成
2. 各手順に詳細な説明を含める
3. 実践的で実行可能な手順にする
4. 手順は論理的な順序で並べる

応答は以下のような階層的なJSON形式にしてください:
{
  "label": "実行手順",
  "children": [
    {
      "label": "手順1のタイトル",
      "description": "手順1の詳細な説明とポイント...",
      "children": []
    }
  ]
}` : `
以下のトピックを達成するための手順を階層的に生成してください。

トピック: "${topic}"

要件:
1. 3-4個のメイン手順を生成
2. 各手順に2-3個の具体的なサブステップを含める
3. 実践的で分かりやすい内容にする

応答は以下のような階層的なJSON形式にしてください:
{
  "label": "実行手順",
  "children": [
    {
      "label": "手順1",
      "children": [
        {
          "label": "サブステップ1-1",
          "children": []
        }
      ]
    }
  ]
}`;
      } else if (isDetailed) {
        prompt = `
以下のトピックについて、詳細な説明付きのマインドマップを生成してください。

トピック: "${topic}"

要件:
1. 3つのメインサブトピックを生成
2. 各サブトピックに詳細な説明を含める
3. 説明は${options?.style || 'technical'}な文体で記述

応答は以下のような階層的なJSON形式にしてください:
{
  "label": "メインテーマ",
  "children": [
    {
      "label": "サブトピック1",
      "description": "詳細な説明をここに記述...",
      "children": []
    }
  ]
}`;
      } else if (isWhat) {
        prompt = isDetailedWhat ? `
以下のトピックについて、詳細な説明を含む階層的な説明を生成してください。

トピック: "${topic}"

要件:
1. 3つの主要な特徴や要素を生成
2. 各特徴に詳細な説明を含める
3. 具体的な例を含める

応答は以下のような階層的なJSON形式にしてください:
{
  "label": "${topic}とは",
  "children": [
    {
      "label": "特徴1",
      "description": "詳細な説明...",
      "children": []
    }
  ]
}` : `
以下のトピックについて、3階層の階層的な説明を生成してください。

トピック: "${topic}"

要件:
1. 3つの主要な特徴や要素を生成
2. 各特徴に2-3個の具体的な説明を含める
3. 簡潔な説明を心がける

応答は以下のような階層的なJSON形式にしてください:
{
  "label": "${topic}とは",
  "children": [
    {
      "label": "特徴1",
      "children": [
        {
          "label": "具体的な説明1-1",
          "children": []
        }
      ]
    }
  ]
}`;
      } else if (isWhich) {
        prompt = isDetailedWhich ? `
以下のトピックについて、選択肢の比較分析を詳細に生成してください。

トピック: "${topic}"

要件:
1. 3-4個の主要な選択基準を生成
2. 各基準に詳細な分析を含める
3. メリット・デメリットを明確に示す

応答は以下のような階層的なJSON形式にしてください:
{
  "label": "${topic}の選択",
  "children": [
    {
      "label": "選択基準1",
      "description": "詳細な分析...",
      "children": []
    }
  ]
}` : `
以下のトピックについて、選択肢の比較を階層的に生成してください。

トピック: "${topic}"

要件:
1. 3つの主要な選択基準を生成
2. 各基準に2-3個の具体的な比較ポイントを含める
3. 簡潔な比較を心がける

応答は以下のような階層的なJSON形式にしてください:
{
  "label": "${topic}の選択",
  "children": [
    {
      "label": "選択基準1",
      "children": [
        {
          "label": "比較ポイント1-1",
          "children": []
        }
      ]
    }
  ]
}`;
      } else {
        prompt = `
以下のトピックについて、3階層の詳細なマインドマップを生成してください。

トピック: "${topic}"

要件:
1. 第1階層: 4-5個の主要カテゴリを生成
2. 第2階層: 各カテゴリに3-4個のサブトピックを生成
3. 第3階層: 各サブトピックに2-3個の具体的な項目を生成
4. シンプルで分かりやすい単語や短いフレーズを使用

応答は以下のような階層的なJSON形式にしてください:
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
}`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
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
  },
}));
