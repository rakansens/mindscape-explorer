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
    for (const item of items) {
      // 各ノードの生成前に待機
      await sleep(800);
      
      // 空のノードを作成
      const newNode = addNode(parentNode, '');
      
      // テキストをアニメーション付きで表示（一文字ずつ）
      await animateText(
        item.text,
        (text) => updateNodeText(newNode.id, text),
        50  // タイピング速度を遅くする
      );

      // ノード生成完了後のコールバック
      if (onNodeGenerated) {
        onNodeGenerated();
      }

      // 子ノードがある場合は、親ノードのアニメーション完了後に生成
      if (item.children && item.children.length > 0) {
        await sleep(500);
        await generateNodes(newNode, item.children, onNodeGenerated);
      }
    }
  };

  return { generateNodes };
};