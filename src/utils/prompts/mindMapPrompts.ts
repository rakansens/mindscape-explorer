import { GenerateOptions } from '../../types/openai';

export const getMindMapPrompt = (topic: string, mode?: string, options?: GenerateOptions): string => {
  const basePrompt = `
以下のトピックについて、マインドマップのノード構造をJSON形式で生成してください。
必ず指定された数のノードを生成してください。

トピック: "${topic}"

応答形式:
{
  "label": "${topic}",
  "children": [
    {
      "label": "サブトピック1",
      "description": "詳細説明（任意）",
      "isTask": false,
      "children": []
    }
  ]
}

必須ルール:
- 必ず指定された数のノードを生成すること
- 各ノードは必ずlabelプロパティを持つこと
- labelは空文字列にしないこと
- childrenは必ず配列であること
- 応答は必ず有効なJSON形式であること
`;

  switch (mode) {
    case 'quick':
      return `${basePrompt}
生成ルール:
- 必ず第1階層に3個のキーポイントを生成すること
- 各キーポイントには1-2個の子ノードを生成
- 説明は簡潔に、必要な場合のみ追加
- 具体的で実用的な内容を重視
`;

    case 'detailed':
      return `${basePrompt}
生成ルール:
- 必ず第1階層に4個の主要トピックを生成すること
- 各トピックに2-3個の子ノードを生成すること
- すべてのノードに必ず詳細な説明を追加（100-200文字）
- 専門的な知識や背景情報も含めること
`;

    case 'why':
      return `${basePrompt}
生成ルール:
- 必ず第1階層に3個の主要な理由を生成すること
- 各理由に2-3個の子ノードを生成すること
- さらに各子ノードに1-2個の詳細な理由を追加
- すべてのノードに必ず理由の説明を追加すること
- 説明は必ず"なぜなら..."で始めること
- 上位ノードほど抽象的、下位ノードほど具体的な理由にすること
`;

    case 'how':
      return `${basePrompt}
生成ルール:
- 必ず第1階層に4個の主要なアクションを生成すること
- 各アクションに2-3個の具体的なステップを生成すること
- すべてのノードで必ずisTask: trueを設定すること
- すべてのノードに具体的な実行手順の説明を追加すること
- 説明は必ず"手順: "で始めること
- 上位ノードは大きな行動、下位ノードは具体的なステップとすること
`;

    case 'ideas':
      return `${basePrompt}
生成ルール:
- 必ず第1階層に10個以上の多様なアイデアを生成すること
- 各アイデアには簡単な説明を追加すること
- 斬新で独創的な発想を含めること
- 異なる分野からのアプローチを含めること
- 意外性のある組み合わせを含めること
- 実現可能性よりも創造性を重視すること
`;

    case 'regenerate':
      return `${basePrompt}
生成ルール:
- 必ず第1階層に4個の新しい視点を生成すること
- 前回とは異なるアプローチで展開すること
- 各視点に2-3個の具体的な展開を追加すること
- 新しい観点や異なる切り口を重視すること
`;

    default:
      return `${basePrompt}
生成ルール:
- 必ず第1階層に3個のキーポイントを生成すること
- 説明は簡潔に、必要な場合のみ追加
`;
  }
};
