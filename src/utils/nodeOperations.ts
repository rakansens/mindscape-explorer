import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

export const removeNodeAndDescendants = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodeId: string
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const nodesToRemove = new Set<string>();
  
  // 子孫ノードのIDを再帰的に収集する関数
  const collectDescendantIds = (currentNodeId: string, visited = new Set<string>()) => {
    // 訪問済みノードをスキップ（循環参照対策）
    if (visited.has(currentNodeId)) return;
    
    visited.add(currentNodeId);
    nodesToRemove.add(currentNodeId);

    // このノードから出ているエッジをすべて探索
    edges.forEach(edge => {
      if (edge.source === currentNodeId) {
        collectDescendantIds(edge.target, visited);
      }
    });
  };

  // 削除対象のノードから探索を開始
  collectDescendantIds(nodeId);

  // 削除対象のノードとそれに関連するエッジを除外
  const filteredNodes = nodes.filter(node => !nodesToRemove.has(node.id));
  const filteredEdges = edges.filter(edge => 
    !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges
  };
};

// ノードの階層レベルを取得
export const getNodeLevel = (edges: Edge[], nodeId: string): number => {
  let level = 0;
  let currentId = nodeId;

  while (true) {
    const parentEdge = edges.find(edge => edge.target === currentId);
    if (!parentEdge) break;
    level++;
    currentId = parentEdge.source;
  }

  return level;
};

// 新しいノードの位置を計算
export const calculateNodePosition = (
  parentNode: Node,
  index: number,
  totalSiblings: number,
  layout: 'horizontal' | 'vertical' | 'radial' = 'horizontal'
) => {
  const HORIZONTAL_SPACING = 250;  // ノード間の水平方向の間隔
  const VERTICAL_SPACING = 100;    // ノード間の垂直方向の間隔
  const verticalOffset = ((index - (totalSiblings - 1) / 2) * VERTICAL_SPACING);

  switch (layout) {
    case 'vertical':
      return {
        x: parentNode.position.x + ((index - (totalSiblings - 1) / 2) * HORIZONTAL_SPACING),
        y: parentNode.position.y + VERTICAL_SPACING + (parentNode.data?.detailedText ? 150 : 0),
      };
    case 'radial':
      const angleStep = (Math.PI * 0.8) / Math.max(totalSiblings - 1, 1);
      const startAngle = -Math.PI * 0.4;
      const angle = startAngle + (index * angleStep);
      const radius = HORIZONTAL_SPACING + (parentNode.data?.detailedText ? 100 : 0);
      return {
        x: parentNode.position.x + Math.cos(angle) * radius,
        y: parentNode.position.y + Math.sin(angle) * radius,
      };
    default: // horizontal
      return {
        x: parentNode.position.x + HORIZONTAL_SPACING + (parentNode.data?.detailedText ? 100 : 0),
        y: parentNode.position.y + verticalOffset,
      };
  }
};

// ノードラベルの検証
export const validateNodeLabel = (label: string): string | null => {
  if (label.trim().length === 0) {
    return '内容を入力してください';
  }
  if (label.length > 50) {
    return '50文字以内で入力してください';
  }
  return null;
};

// イベントの伝播を防止
export const preventEvent = (e: React.MouseEvent | React.PointerEvent): void => {
  e.preventDefault();
  e.stopPropagation();
  if (e.target instanceof HTMLElement) {
    e.target.style.pointerEvents = 'auto';
  }
};

// ノードのプロパティを取得
export const getNodeProperties = (node: Node) => {
  return {
    isTask: node.data?.isTask || false,
    isCompleted: node.data?.isCompleted || false,
    detailedText: node.data?.detailedText || '',
    isCollapsed: node.data?.isCollapsed || false,
  };
};
