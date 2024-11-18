import dagre from 'dagre';
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const PADDING = 100; // 画面端からの余白

// 中央配置のための共通関数
const calculateCenterPosition = (width: number, height: number) => ({
  x: (width - NODE_WIDTH) / 2,
  y: (height - NODE_HEIGHT) / 2
});

// ビューポート内に収まるように位置を調整
const adjustPositionToViewport = (
  x: number,
  y: number,
  width: number,
  height: number
) => ({
  x: Math.max(PADDING, Math.min(width - NODE_WIDTH - PADDING, x)),
  y: Math.max(PADDING, Math.min(height - NODE_HEIGHT - PADDING, y))
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
    const position = adjustPositionToViewport(
      nodeWithPosition.x - NODE_WIDTH / 2,
      nodeWithPosition.y - NODE_HEIGHT / 2,
      window.innerWidth,
      window.innerHeight
    );
    
    return {
      ...node,
      position
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
    const position = adjustPositionToViewport(
      center.x + radius * Math.cos(angle),
      center.y + radius * Math.sin(angle),
      width,
      height
    );
    
    return {
      ...node,
      position
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
  const layoutedNodes = nodes.map((node, index) => {
    const position = adjustPositionToViewport(
      center.x + (index % 3) * (NODE_WIDTH + 50),
      center.y + Math.floor(index / 3) * (NODE_HEIGHT + 50),
      width,
      height
    );
    
    return {
      ...node,
      position
    };
  });

  return { nodes: layoutedNodes, edges };
};