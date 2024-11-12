import { Node } from 'reactflow';
import { HierarchyItem } from '../../types/common';
import { sleep, animateText } from '../../utils/animationUtils';
import { useMindMapStore } from '../../store/mindMapStore';

// ノードの配置に関する定数
const SPACING = {
  RADIUS: 250,      // 親ノードからの基本距離
  LEVEL_OFFSET: 150 // 階層ごとの追加距離
};

export const useNodeGenerator = () => {
  const { addNode, updateNodeText } = useMindMapStore();

  // ノードの位置を計算する関数
  const calculateNodePosition = (
    parentNode: Node,
    index: number,
    totalNodes: number,
    level: number = 0
  ) => {
    // 角度を計算（360度をノード数で割り、さらにオフセットを加える）
    const angle = ((index * (360 / totalNodes)) + 45) * (Math.PI / 180);
    
    // 階層に応じて距離を増やす
    const radius = SPACING.RADIUS + (level * SPACING.LEVEL_OFFSET);
    
    return {
      x: parentNode.position.x + Math.cos(angle) * radius,
      y: parentNode.position.y + Math.sin(angle) * radius
    };
  };

  const generateNodes = async (
    parentNode: Node,
    items: HierarchyItem[],
    onNodeGenerated?: () => void,
    level: number = 0
  ) => {
    // 各アイテムを順番に処理
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // 最初のノード以外は、前のノードとの間に十分な待機時間を設ける
      if (i > 0) {
        await sleep(800);
      }

      // ノードの位置を計算
      const position = calculateNodePosition(parentNode, i, items.length, level);

      // 計算された位置で新しいノードを作成
      const newNode = addNode(parentNode, '', position);
      
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
        100  // タイピング速度を遅く設定
      );

      // テキスト表示完了後の待機
      await sleep(500);

      // 子ノードがある場合は、親ノードの生成完了後に十分待ってから生成
      if (item.children && item.children.length > 0) {
        await sleep(800);
        await generateNodes(newNode, item.children, onNodeGenerated, level + 1);
      }
    }
  };

  return { generateNodes };
};
