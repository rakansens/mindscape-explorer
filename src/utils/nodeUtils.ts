import { Edge, Node as ReactFlowNode } from 'reactflow';
import { HierarchyItem } from '../types/common';
import { TopicTree } from '../types/openai';
import { theme } from '../styles/theme';

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

// TopicTreeをHierarchyItemに変換
export const parseTopicTree = (topicTree: TopicTree): HierarchyItem[] => {
  const hierarchy: HierarchyItem[] = [];
  
  const processNode = (node: TopicTree, level: number = 0): HierarchyItem => {
    const item: HierarchyItem = {
      level,
      text: node.label,
      children: []
    };
    
    if (node.children && node.children.length > 0) {
      item.children = node.children.map(child => processNode(child, level + 1));
    }
    
    return item;
  };

  if (topicTree.children) {
    hierarchy.push(...topicTree.children.map(child => processNode(child, 0)));
  }

  return hierarchy;
};

export const calculateNodePosition = (
  parentNode: ReactFlowNode,
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

export const getNodeStyle = (level: number, isAppearing?: boolean, isRemoving?: boolean): string => {
  const baseStyle = (() => {
    switch(level) {
      case 0:
        return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg shadow-blue-200';
      case 1:
        return 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-semibold shadow-indigo-200';
      case 2:
        return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-200';
      default:
        return 'bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-violet-200';
    }
  })();

  const animationStyle = (() => {
    if (isAppearing) {
      return 'animate-in fade-in zoom-in duration-300';
    }
    if (isRemoving) {
      return 'animate-out fade-out zoom-out duration-300';
    }
    return '';
  })();

  return `${baseStyle} ${animationStyle}`;
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

export const getNodeProperties = (node: ReactFlowNode) => {
  return {
    isTask: node.data?.isTask || false,
    isCompleted: node.data?.isCompleted || false,
    detailedText: node.data?.detailedText || '',
    isCollapsed: node.data?.isCollapsed || false,
  };
};
