import { useColorSchemeStore } from '../store/colorSchemeStore';
import { Node as ReactFlowNode } from 'reactflow';

export const getNodeStyle = (level: number) => {
  const { currentScheme } = useColorSchemeStore.getState();
  
  switch (level) {
    case 0:
      return `${currentScheme.primary} hover:brightness-110`;
    case 1:
      return `${currentScheme.secondary} hover:brightness-110`;
    default:
      return `${currentScheme.accent} hover:brightness-110`;
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