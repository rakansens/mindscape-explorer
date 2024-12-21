import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';
import { useLayoutStore } from '../store/layoutStore';

const SPACING = {
  NORMAL: {
    HORIZONTAL: 250,
    VERTICAL: 100
  },
  COMPACT: {
    HORIZONTAL: 180,
    VERTICAL: 60
  }
};

export const calculateNewNodePosition = (
  parentNode: Node<NodeData>,
  nodes: Node<NodeData>[],
  edges: Edge[]
) => {
  const { layout } = useLayoutStore.getState();
  const spacing = layout.isCompact ? SPACING.COMPACT : SPACING.NORMAL;

  const childNodes = nodes.filter(node => 
    edges.some(edge => 
      edge.source === parentNode.id && 
      edge.target === node.id
    )
  );

  if (childNodes.length === 0) {
    return {
      x: parentNode.position.x + spacing.HORIZONTAL,
      y: parentNode.position.y
    };
  }

  const childYPositions = childNodes.map(node => node.position.y).sort((a, b) => a - b);
  const newY = childYPositions[childYPositions.length - 1] + spacing.VERTICAL;

  return {
    x: parentNode.position.x + spacing.HORIZONTAL,
    y: newY
  };
};