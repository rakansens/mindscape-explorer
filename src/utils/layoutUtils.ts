import dagre from 'dagre';
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';
import * as d3Force from 'd3-force';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const PADDING = 100;

const validateGraph = (nodes: Node[], edges: Edge[]) => {
  // Check if all edge endpoints exist in nodes
  return edges.every(edge => 
    nodes.some(node => node.id === edge.source) && 
    nodes.some(node => node.id === edge.target)
  );
};

export const getLayoutedElements = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  options: {
    direction: 'TB' | 'LR' | 'RL';
    nodeSpacing?: number;
    rankSpacing?: number;
  }
) => {
  if (!nodes.length) return { nodes, edges };
  if (!validateGraph(nodes, edges)) {
    console.warn('Invalid graph structure detected');
    return { nodes, edges };
  }

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const { direction = 'LR', nodeSpacing = 100, rankSpacing = 200 } = options;

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    ranker: 'network-simplex'
  });

  // Add nodes to the graph with their dimensions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    if (edge.source && edge.target) {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  // Apply the layout
  try {
    dagre.layout(dagreGraph);
  } catch (error) {
    console.error('Dagre layout error:', error);
    return { nodes, edges };
  }

  // Retrieve the positioned nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (!nodeWithPosition) {
      return node;
    }
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2
      }
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
  if (!nodes.length) return { nodes, edges };

  const centerX = width / 2;
  const centerY = height / 2;
  
  // ノード数に応じて半径を動的に調整
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

export const applyForceLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  width: number,
  height: number
) => {
  if (!nodes.length) return { nodes, edges };

  // ノードとエッジのコピーを作成
  const nodesCopy = nodes.map(node => ({ ...node }));
  const edgesCopy = edges.map(edge => ({ ...edge }));

  // シミュレーション用のデータ構造を作成
  const simulation = d3Force.forceSimulation(nodesCopy as any)
    .force('charge', d3Force.forceManyBody().strength(-300))
    .force('center', d3Force.forceCenter(width / 2, height / 2).strength(0.1))
    .force('collision', d3Force.forceCollide().radius(80))
    .force('link', d3Force.forceLink(edgesCopy).id((d: any) => d.id).distance(150));

  // シミュレーションを実行
  for (let i = 0; i < 300; i++) {
    simulation.tick();
  }

  // 新しい位置を元のノードに適用
  const updatedNodes = nodes.map((originalNode, i) => ({
    ...originalNode,
    position: {
      x: Math.max(0, Math.min(width - 200, (nodesCopy[i] as any).x)),
      y: Math.max(0, Math.min(height - 100, (nodesCopy[i] as any).y))
    }
  }));

  simulation.stop();

  // エッジの属性を完全に保持
  const updatedEdges = edges.map(originalEdge => ({
    ...originalEdge,
    id: originalEdge.id,
    source: originalEdge.source,
    target: originalEdge.target,
    type: originalEdge.type || 'custom',
    animated: true,
    sourceHandle: originalEdge.sourceHandle,
    targetHandle: originalEdge.targetHandle,
    style: originalEdge.style
  }));

  return {
    nodes: updatedNodes,
    edges: updatedEdges
  };
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
