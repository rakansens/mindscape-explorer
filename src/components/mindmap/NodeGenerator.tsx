import { Node } from 'reactflow';
import { HierarchyItem } from '../../types/common';
import { sleep, animateText } from '../../utils/animationUtils';
import { useMindMapStore } from '../../store/mindMapStore';

export const useNodeGenerator = () => {
  const { addNode, updateNodeText } = useMindMapStore();

  const generateNodes = async (
    parentNode: Node,
    items: HierarchyItem[],
    onNodeGenerated?: () => void
  ) => {
    // 各アイテムを順番に処理
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // 最初のノード以外は、前のノードとの間に十分な待機時間を設ける
      if (i > 0) {
        await sleep(800);
      }

      // 空のノードを作成
      const newNode = addNode(parentNode, '');
      
      // ノードが追加された直後にビューを調整
      if (onNodeGenerated) {
        onNodeGenerated();
      }

      // 視覚的なフィードバックのための待機
      await sleep(500);
      
      // テキストを一文字ずつアニメーション表示（タイピング速度を遅く）
      await animateText(
        item.text,
        async (text) => {
          updateNodeText(newNode.id, text);
          // 各文字が追加されるたびにビューを微調整
          if (onNodeGenerated) {
            onNodeGenerated();
          }
        },
        100  // タイピング速度を遅く設定
      );

      // テキスト表示完了後の待機
      await sleep(500);

      // 子ノードがある場合は、親ノードの生成完了後に十分待ってから生成
      if (item.children && item.children.length > 0) {
        await sleep(800);
        await generateNodes(newNode, item.children, onNodeGenerated);
      }
    }
  };

  return { generateNodes };
};