import dagre from 'dagre';
import { Node, Edge, Position } from 'reactflow';
import { NodeData } from '../types/node';

interface LayoutOptions {
  direction?: 'TB' | 'LR' | 'RL';
  nodeWidth?: number;
  nodeHeight?: number;
  rankSpacing?: number;
  nodeSpacing?: number;
}

// エッジの接続点を最適化する関数
const optimizeEdgeHandles = (nodes: Node<NodeData>[], edges: Edge[]) => {
  return edges.map(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return edge;

    const dx = targetNode.position.x - sourceNode.position.x;
    const dy = targetNode.position.y - sourceNode.position.y;

    let sourceHandle, targetHandle;

    if (Math.abs(dx) > Math.abs(dy)) {
      // 水平方向の接続
      if (dx > 0) {
        sourceHandle = 'right';
        targetHandle = 'left';
      } else {
        sourceHandle = 'left';
        targetHandle = 'right';
      }
    } else {
      // 垂直方向の接続
      if (dy > 0) {
        sourceHandle = 'bottom';
        targetHandle = 'top';
      } else {
        sourceHandle = 'top';
        targetHandle = 'bottom';
      }
    }

    return {
      ...edge,
      sourceHandle,
      targetHandle,
    };
  });
};

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

  // エッジの最適化を適用
  const optimizedEdges = optimizeEdgeHandles(layoutedNodes, edges);

  return { nodes: layoutedNodes, edges: optimizedEdges };
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

  // エッジの最適化を適用
  const optimizedEdges = optimizeEdgeHandles(layoutedNodes, edges);

  return { nodes: layoutedNodes, edges: optimizedEdges };
};

// 標準レイアウト
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

  // エッジの最適化を適用
  const optimizedEdges = optimizeEdgeHandles(layoutedNodes, edges);

  return { 
    nodes: layoutedNodes, 
    edges: optimizedEdges 
  };
};

export { getCircleLayout, getOrthogonalLayout };