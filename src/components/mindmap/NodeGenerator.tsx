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
    // 各階層のノードを順番に生成
    for (const item of items) {
      // まず空のノードを作成して表示
      const newNode = addNode(parentNode, '');
      
      // ノードが追加された直後にビューを調整
      if (onNodeGenerated) {
        onNodeGenerated();
      }

      // 視覚的なフィードバックのための待機
      await sleep(500);
      
      // テキストを一文字ずつアニメーション表示
      await animateText(
        item.text,
        async (text) => {
          updateNodeText(newNode.id, text);
          // 各文字が追加されるたびにビューを微調整
          if (onNodeGenerated) {
            onNodeGenerated();
          }
        },
        100  // タイピング速度をさらに遅く
      );

      // 次のノード生成前の待機時間
      await sleep(800);

      // 子ノードがある場合は、さらに待機してから生成
      if (item.children && item.children.length > 0) {
        await sleep(1000);
        await generateNodes(newNode, item.children, onNodeGenerated);
      }
    }
  };

  return { generateNodes };
};