import { Node, Edge } from 'reactflow';
import { NodeData } from '../../types/node';

export const saveMapOperation = (nodes: Node<NodeData>[], edges: Edge[]) => {
  localStorage.setItem('mindmap', JSON.stringify({ nodes, edges }));
};

export const loadMapOperation = () => {
  const saved = localStorage.getItem('mindmap');
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
};

export const importFromJSONOperation = (jsonString: string) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.nodes && data.edges) {
      return { nodes: data.nodes, edges: data.edges };
    }
  } catch (error) {
    console.error('Failed to import JSON:', error);
  }
  return null;
};
