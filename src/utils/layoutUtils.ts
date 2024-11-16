import dagre from 'dagre';
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

interface LayoutOptions {
  direction?: 'TB' | 'LR' | 'RL';
  nodeWidth?: number;
  nodeHeight?: number;
  rankSpacing?: number;
  nodeSpacing?: number;
}

// 円形レイアウトの実装
const getCircleLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  width: number,
  height: number
) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  
  const layoutedNodes = nodes.map((node, index) => {
    const angle = (index * 2 * Math.PI) / nodes.length;
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle) - 100,
        y: centerY + radius * Math.sin(angle) - 50
      }
    };
  });

  return { nodes: layoutedNodes, edges };
};

// 直交レイアウトの実装
const getOrthogonalLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  options: LayoutOptions
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  dagreGraph.setGraph({
    rankdir: options.direction || 'LR',
    nodesep: options.nodeSpacing || 100,
    ranksep: options.rankSpacing || 200,
    marginx: 50,
    marginy: 50,
    edgesep: 80,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { 
      width: options.nodeWidth || 200,
      height: options.nodeHeight || 100
    });
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
        x: nodeWithPosition.x - (options.nodeWidth || 200) / 2,
        y: nodeWithPosition.y - (options.nodeHeight || 100) / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// 通常のレイアウト
export const getLayoutedElements = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  options: LayoutOptions = {}
) => {
  const {
    direction = 'LR',
    nodeWidth = 200,
    nodeHeight = 100,
    rankSpacing = 200,
    nodeSpacing = 100,
  } = options;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR' || direction === 'RL';
  
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { 
      width: nodeWidth, 
      height: nodeHeight 
    });
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
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export { getCircleLayout, getOrthogonalLayout };