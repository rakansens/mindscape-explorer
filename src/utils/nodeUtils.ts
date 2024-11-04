import { Edge } from 'reactflow';

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

export const getNodeStyle = (level: number): string => {
  switch(level) {
    case 0:
      return 'bg-gradient-to-br from-blue-500 to-blue-600';
    case 1:
      return 'bg-gradient-to-br from-indigo-500 to-indigo-600';
    case 2:
      return 'bg-gradient-to-br from-purple-500 to-purple-600';
    default:
      return 'bg-gradient-to-br from-violet-500 to-violet-600';
  }
};