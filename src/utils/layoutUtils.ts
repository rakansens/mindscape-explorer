import dagre from 'dagre';
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const PADDING = 100;

// レイアウト全体を中央に配置する関数
const centerLayout = (
  nodes: Node<NodeData>[],
  width: number,
  height: number
) => {
  if (nodes.length === 0) return nodes;

  // レイアウト全体のバウンディングボックスを計算
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x);
    maxX = Math.max(maxX, node.position.x + NODE_WIDTH);
    minY = Math.min(minY, node.position.y);
    maxY = Math.max(maxY, node.position.y + NODE_HEIGHT);
  });

  // レイアウトの中心点を計算
  const layoutWidth = maxX - minX;
  const layoutHeight = maxY - minY;
  const offsetX = (width - layoutWidth) / 2 - minX;
  const offsetY = (height - layoutHeight) / 2 - minY;

  // すべてのノードを中央に移動
  return nodes.map(node => ({
    ...node,
    position: {
      x: node.position.x + offsetX,
      y: node.position.y + offsetY
    }
  }));
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
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const { direction = 'LR', nodeSpacing = 100, rankSpacing = 200 } = options;

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    align: 'UDR', // 中央寄せに変更
    ranker: 'network-simplex'
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
        y: nodeWithPosition.y - NODE_HEIGHT / 2
      }
    };
  });

  // レイアウト全体を中央に配置
  const centeredNodes = centerLayout(layoutedNodes, window.innerWidth, window.innerHeight);

  return { nodes: centeredNodes, edges };
};

export const getCircleLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  width: number,
  height: number
) => {
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
  // ノードとエッジのコピーを作成
  const nodesCopy = nodes.map(node => ({ ...node }));
  const edgesCopy = edges.map(edge => ({ ...edge }));

  // シミュレーション用のデータ構造を作成
  const simulation = d3.forceSimulation(nodesCopy as any)
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2).strength(0.1))
    .force('collision', d3.forceCollide().radius(80))
    .force('link', d3.forceLink(edgesCopy).id((d: any) => d.id).distance(150));

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
