import { Node } from 'reactflow';
import { HierarchyItem } from '../../types/common';
import { sleep, animateText } from '../../utils/animationUtils';
import { useMindMapStore } from '../../store/mindMapStore';
import { calculateNodePosition } from '../../utils/nodeUtils';

export const useNodeGenerator = () => {
  const { addNode, updateNodeText } = useMindMapStore();

  const generateNodes = async (
    parentNode: Node,
    items: HierarchyItem[],
    onComplete?: () => void
  ) => {
    // 各アイテムを順番に処理
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // 新しいノードの位置を計算
      const position = calculateNodePosition(
        parentNode,
        i,
        items.length,
        'horizontal'  // デフォルトのレイアウトとして水平方向を使用
      );

      // 空のノードを作成（位置を指定）
      const newNode = addNode(parentNode, '', position);
      
      // 視覚的なフィードバックのための待機
      await sleep(500);
      
      // テキストを一文字ずつアニメーション表示
      await animateText(
        item.text,
        async (text) => {
          updateNodeText(newNode.id, text);
        },
        100
      );

      // テキスト表示完了後の待機
      await sleep(500);

      // 子ノードがある場合は、親ノードの生成完了後に処理
      if (item.children && item.children.length > 0) {
        await sleep(800);
        await generateNodes(newNode, item.children);
      }
    }

    // 生成完了後のコールバックを実行
    if (onComplete) {
      onComplete();
    }
  };

  return { generateNodes };
};