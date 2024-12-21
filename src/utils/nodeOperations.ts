import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';
import { v4 as uuidv4 } from 'uuid';

export const addNodeWithPosition = (
  nodes: Node<NodeData>[],
  parentNode: Node<NodeData>,
  label: string,
  position: { x: number; y: number }
): Node<NodeData> => {
  return {
    id: uuidv4(),
    type: 'custom',
    position,
    data: { 
      label,
      isGenerating: false,
      isAppearing: true
    },
  };
};

export const updateNodeWithData = (
  nodes: Node<NodeData>[],
  nodeId: string,
  data: Partial<NodeData>
): Node<NodeData>[] => {
  return nodes.map((node) =>
    node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
  );
};

export const getNodeChildren = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodeId: string
): Node<NodeData>[] => {
  const childIds = edges
    .filter(edge => edge.source === nodeId)
    .map(edge => edge.target);
  
  return nodes.filter(node => childIds.includes(node.id));
};