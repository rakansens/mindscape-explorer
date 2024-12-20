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
        'horizontal'
      );

      // 空のノードを作成（位置を指定）
      const newNode = addNode(parentNode, '', position);
      
      // 視覚的なフィードバックの待機時間を最小限に
      await sleep(50);
      
      // テキストを一文字ずつアニメーション表示（さらに高速化）
      await animateText(
        item.text,
        async (text) => {
          updateNodeText(newNode.id, text);
        },
        20  // タイピング速度をさらに高速化
      );

      // テキスト表示完了後の待機時間を最小限に
      await sleep(50);

      // 子ノードがある場合は、親ノードの生成完了後に処理
      if (item.children && item.children.length > 0) {
        await sleep(100);  // 子ノード生成前の待機時間も最小限に
        await generateNodes(newNode, item.children);
      }
    }

    if (onComplete) {
      onComplete();
    }
  };

  return { generateNodes };
};