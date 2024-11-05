import { useColorSchemeStore } from '../store/colorSchemeStore';
import { Node as ReactFlowNode, Edge } from 'reactflow';

export const getNodeLevel = (edges: Edge[], nodeId: string, level: number = 0): number => {
  const parentEdge = edges.find(edge => edge.target === nodeId);
  if (!parentEdge) return 0;
  return getNodeLevel(edges, parentEdge.source, level + 1);
};

export const getNodeStyle = (level: number) => {
  const { currentScheme } = useColorSchemeStore.getState();
  
  const baseClasses = 'transition-colors duration-200';
  
  switch (level) {
    case 0:
      return `${currentScheme.primary} ${baseClasses} hover:opacity-90`;
    case 1:
      return `${currentScheme.secondary} ${baseClasses} hover:opacity-90`;
    default:
      return `${currentScheme.accent} ${baseClasses} hover:opacity-90`;
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