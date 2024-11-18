import dagre from 'dagre';
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const PADDING = 50; // パディング値を100から50に減少

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
  
  // 親ノードを中心に配置
  const parentNode = nodes.find(node => node.id === "1");
  const childNodes = nodes.filter(node => node.id !== "1");
  
  // ノード数に応じて半径を動的に調整（親ノードを除く）
  const radius = Math.min(
    (Math.min(width, height) - PADDING * 2) / 2.5, // 2.5で割ることで、より小さな円を作成
    childNodes.length * 50 // ノードごとの必要なスペースを考慮
  );

  const layoutedNodes = nodes.map(node => {
    if (node.id === "1") {
      // 親ノードは中心に配置
      return {
        ...node,
        position: {
          x: centerX - NODE_WIDTH / 2,
          y: centerY - NODE_HEIGHT / 2
        }
      };
    } else {
      // 子ノードを円周上に配置
      const index = childNodes.findIndex(n => n.id === node.id);
      const totalNodes = childNodes.length;
      const angle = (index * 2 * Math.PI) / totalNodes - Math.PI / 2; // -Math.PI/2 で上から配置開始
      
      return {
        ...node,
        position: {
          x: centerX + radius * Math.cos(angle) - NODE_WIDTH / 2,
          y: centerY + radius * Math.sin(angle) - NODE_HEIGHT / 2
        }
      };
    }
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
