import { Node, Edge } from 'reactflow';
import { NodeData } from '../../types/node';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const PADDING = 100;

export const getCircleLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  width: number,
  height: number
) => {
  if (!nodes.length) return { nodes, edges };

  const centerX = width / 2;
  const centerY = height / 2;
  
  const radius = Math.min(
    (Math.min(width, height) - PADDING * 2) / 2,
    nodes.length * NODE_WIDTH / (2 * Math.PI)
  );

  const layoutedNodes = nodes.map((node, index) => {
    const angle = (index * 2 * Math.PI) / nodes.length;
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle) - NODE_WIDTH / 2,
        y: centerY + radius * Math.sin(angle) - NODE_HEIGHT / 2
      }
    };
  });

  return { nodes: layoutedNodes, edges };
};