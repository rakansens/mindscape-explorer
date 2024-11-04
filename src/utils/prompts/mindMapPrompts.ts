import { GenerateOptions } from '../../types/openai';

export const getMindMapPrompt = (topic: string, mode?: string, options?: GenerateOptions): string => {
  const isHow = mode === 'how';
  const isDetailed = mode === 'detailed';
  const isDetailedHow = isHow && options?.howType === 'detailed';
  const isWhy = mode === 'why';
  const isDetailedWhy = isWhy && options?.whyType === 'detailed';
  const isWhat = mode === 'what';
  const isDetailedWhat = isWhat && options?.whatType === 'detailed';
  const isWhich = mode === 'which';
  const isDetailedWhich = isWhich && options?.whichType === 'detailed';

  // デフォルトのクイックマップ生成用プロンプト
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

  if (isWhy) {
    return `
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
          "children": []
        }
      ]
    }
  ]
}`;
  } else if (isHow) {
    return `
以下のトピックを達成するための${isDetailedHow ? '詳細な' : ''}手順を生成してください。

トピック: "${topic}"

要件:
1. ${isDetailedHow ? '5-7個' : '3-4個'}の具体的な手順を生成
2. 各手順に${isDetailedHow ? '詳細な説明' : '2-3個の具体的なサブステップ'}を含める
3. 実践的で実行可能な手順にする
4. 手順は論理的な順序で並べる

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
  } else if (isWhat) {
    return `
以下のトピックについて、3階層の階層的な説明を生成してください。

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
}`;
  } else if (isWhich) {
    return `
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
  }

  return defaultPrompt;
};