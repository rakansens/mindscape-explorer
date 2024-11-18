import dagre from 'dagre';
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

// 中央配置のための共通関数
const calculateCenterPosition = (width: number, height: number) => ({
  x: width / 2 - NODE_WIDTH / 2,
  y: height / 2 - NODE_HEIGHT / 2
});

export const getLayoutedElements = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  options: {
    direction: 'TB' | 'LR' | 'RL';
    nodeSpacing?: number;
    rankSpacing?: number;
  }
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const { direction = 'LR', nodeSpacing = 100, rankSpacing = 200 } = options;

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    align: 'DL',
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const getCircleLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  width: number,
  height: number
) => {
  const center = calculateCenterPosition(width, height);
  const radius = Math.min(width, height) * 0.35;
  
  const layoutedNodes = nodes.map((node, index) => {
    const angle = (index * 2 * Math.PI) / nodes.length;
    return {
      ...node,
      position: {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const getOrthogonalLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  options: {
    direction: 'TB' | 'LR' | 'RL';
    nodeSpacing?: number;
    rankSpacing?: number;
  }
) => {
  return getLayoutedElements(nodes, edges, {
    ...options,
    nodeSpacing: options.nodeSpacing || 150,
    rankSpacing: options.rankSpacing || 200,
  });
};

export const applyForceLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  width: number,
  height: number
) => {
  const center = calculateCenterPosition(width, height);
  const layoutedNodes = nodes.map((node, index) => ({
    ...node,
    position: {
      x: center.x + (index % 3) * NODE_WIDTH,
      y: center.y + Math.floor(index / 3) * NODE_HEIGHT,
    },
  }));

  return { nodes: layoutedNodes, edges };
};