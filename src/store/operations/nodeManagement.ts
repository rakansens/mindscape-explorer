import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';
import { nanoid } from 'nanoid';

export const addNodeOperation = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  parentNode: Node<NodeData>,
  label: string,
  position?: { x: number; y: number },
  additionalData: Partial<NodeData> = {}
) => {
  const newNode: Node<NodeData> = {
    id: nanoid(),
    type: 'custom',
    position: position || { x: 0, y: 0 },
    data: {
      label,
      isGenerating: false,
      isAppearing: false,
      selected: false,
      ...additionalData
    },
  };

  const newEdge = parentNode
    ? {
        id: `${parentNode.id}-${newNode.id}`,
        source: parentNode.id,
        target: newNode.id,
        type: 'custom',
      }
    : null;

  return {
    nodes: [...nodes, newNode],
    edges: newEdge ? [...edges, newEdge] : edges,
    newNode,
  };
};

export const updateNodeOperation = (
  nodes: Node<NodeData>[],
  nodeId: string,
  updates: Partial<NodeData>
) => {
  return nodes.map(node =>
    node.id === nodeId
      ? {
          ...node,
          data: {
            ...node.data,
            ...updates
          }
        }
      : node
  );
};

export const selectNodeOperation = (
  nodes: Node<NodeData>[],
  selectedId: string
) => {
  return nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      selected: node.id === selectedId
    }
  }));
};