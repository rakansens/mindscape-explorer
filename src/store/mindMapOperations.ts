import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';
import { useHistoryStore } from './historyStore';

export const addNodeOperation = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  parentNode: Node<NodeData>,
  label: string,
  position: { x: number; y: number },
  additionalData: Partial<NodeData> = {}
) => {
  const newNode: Node<NodeData> = {
    id: crypto.randomUUID(),
    type: 'custom',
    position,
    data: {
      label,
      isGenerating: false,
      isAppearing: false,
      selected: false,
      ...additionalData
    },
  };

  const newEdge: Edge = {
    id: `${parentNode.id}-${newNode.id}`,
    source: parentNode.id,
    target: newNode.id,
    type: 'custom',
  };

  return {
    nodes: [...nodes, newNode],
    edges: [...edges, newEdge],
    newNodeId: newNode.id,
  };
};

export const removeNodesOperation = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodeIdsToRemove: string[]
) => {
  const updatedNodes = nodes.filter(node => !nodeIdsToRemove.includes(node.id));
  const updatedEdges = edges.filter(
    edge => !nodeIdsToRemove.includes(edge.source) && !nodeIdsToRemove.includes(edge.target)
  );

  return { nodes: updatedNodes, edges: updatedEdges };
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