import { GenerateOptions } from '../../types/openai';

export const getMindMapPrompt = (topic: string, mode?: string, options?: GenerateOptions): string => {
  const structure = options?.structure || { 
    level1: mode === 'ideas' ? 10 : 3,
    level2: mode === 'quick' ? 2 : 3,
    level3: mode === 'quick' ? 2 : 2
  };
  
  const basePrompt = `
以下のトピックについて、マインドマップのノード構造をJSON形式で生成してください。

トピック: "${topic}"

必ず以下の形式のJSONで返してください:
{
  "label": "トピック名",
  "children": [
    {
      "label": "サブトピック1",
      "description": "詳細説明",
      "children": []
    }
  ]
}

生成ルール:
- 第1階層のノード数: ${structure.level1}個
- 第2階層のノード数: ${structure.level2}個（必要な場合）
- 第3階層のノード数: ${structure.level3}個（必要な場合）
- 各ノードは必ずlabelプロパティを持つ
- 説明が必要な場合はdescriptionプロパティを追加
- childrenは必ず配列（空の場合は[]）

応答は必ず有効なJSON形式でお願いします。
`;

  switch (mode) {
    case 'detailed':
      return `${basePrompt}
追加の要件:
- 各ノードに詳細な説明をdescriptionとして追加
- 説明は100-200文字程度
`;

    case 'why':
      return `${basePrompt}
追加の要件:
- 各ノードは"なぜ？"の視点で展開
- 各ノードに理由の説明をdescriptionとして追加
`;

    case 'how':
      return `${basePrompt}
追加の要件:
- 各ノードは"どうやって？"の視点で具体的なアクションとして展開
- 各ノードに実行手順の説明をdescriptionとして追加
`;

    case 'ideas':
      return `${basePrompt}
追加の要件:
- より多くのアイデアを生成（第1階層で${structure.level1}個）
- 斬新で独創的なアイデアを含める
- 必要に応じて簡単な説明を追加
`;

    case 'quick':
    default:
      return `${basePrompt}
追加の要件:
- シンプルな構造で展開
- 説明は必要な場合のみ追加
`;
  }
};
