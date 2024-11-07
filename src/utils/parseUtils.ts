interface TopicItem {
  text: string;
  description?: string;
  isTask?: boolean;
  children?: TopicItem[];
}

export const parseTopicTree = (response: any): TopicItem[] => {
  try {
    // 文字列の場合はJSONとしてパース
    const data = typeof response === 'string' ? JSON.parse(response) : response;

    // トップレベルの children 配列を取得
    const children = data.children || [];

    // 子ノードが0個の場合はエラーとして扱う
    if (children.length === 0) {
      throw new Error('Generated nodes cannot be empty');
    }

    // 各アイテムを変換
    return children.map((item: any) => ({
      text: item.label || '',
      description: item.description,
      isTask: item.isTask || false,
      children: Array.isArray(item.children) ? item.children : []
    }));
  } catch (error) {
    console.error('Failed to parse topic tree:', error);
    // エラー時はデフォルトノードを返す
    return [{
      text: '生成に失敗しました',
      description: '再度生成を試みてください',
      isTask: false,
      children: []
    }];
  }
}; 