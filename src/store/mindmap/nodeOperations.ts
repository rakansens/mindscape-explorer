import { Node, Edge } from 'reactflow';
import { NodeData } from '../../types/node';
import { MindMapState } from './types';

export const updateNode = (state: MindMapState, id: string, data: Partial<NodeData>) => ({
  nodes: state.nodes.map((node) =>
    node.id === id ? { ...node, data: { ...node.data, ...data } } : node
  ),
});

export const updateNodeText = (state: MindMapState, id: string, text: string) => ({
  nodes: state.nodes.map((node) =>
    node.id === id ? { ...node, data: { ...node.data, label: text } } : node
  ),
});

export const addNode = (
  state: MindMapState,
  parentNode: Node,
  label: string,
  position: { x: number; y: number }
): { nodes: Node<NodeData>[]; edges: Edge[]; newNode: Node } => {
  const newNode: Node<NodeData> = {
    id: String(Date.now()),
    type: 'custom',
    position,
    data: { 
      label,
      isGenerating: false,
      isAppearing: true
    },
  };

  return {
    nodes: [...state.nodes, newNode],
    edges: [
      ...state.edges,
      {
        id: `e${parentNode.id}-${newNode.id}`,
        source: parentNode.id,
        target: newNode.id,
        type: 'custom',
        animated: true
      },
    ],
    newNode,
  };
};

export const selectNode = (state: MindMapState, id: string) => ({
  selectedNodeId: id,
  nodes: state.nodes.map((node) => ({
    ...node,
    data: { ...node.data, selected: node.id === id },
  })),
});