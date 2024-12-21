import dagre from 'dagre';
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';
import * as d3Force from 'd3-force';
import * as d3Hierarchy from 'd3-hierarchy';

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

  // Create hierarchy data structure
  const hierarchyData = createHierarchyData(nodes, edges);
  const root = d3Hierarchy.hierarchy(hierarchyData);

  // Apply tree layout
  const treeLayout = d3Hierarchy.tree<any>()
    .nodeSize([NODE_HEIGHT + (options.nodeSpacing || 100), NODE_WIDTH + (options.rankSpacing || 200)]);

  treeLayout(root);

  // Transform coordinates based on direction
  const isHorizontal = options.direction === 'LR' || options.direction === 'RL';
  const layoutedNodes = nodes.map(node => {
    const hierarchyNode = root.find(d => d.data.id === node.id);
    if (!hierarchyNode) return node;

    let x = hierarchyNode.x;
    let y = hierarchyNode.y;

    if (isHorizontal) {
      [x, y] = [y, x];
    }

    if (options.direction === 'RL') {
      x = -x;
    }

    return {
      ...node,
      position: {
        x: x,
        y: y
      }
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Helper function to create hierarchy data structure
const createHierarchyData = (nodes: Node<NodeData>[], edges: Edge[]) => {
  const rootNode = nodes.find(node => !edges.some(edge => edge.target === node.id));
  if (!rootNode) return { id: 'root', children: [] };

  const buildHierarchy = (nodeId: string): any => {
    const children = edges
      .filter(edge => edge.source === nodeId)
      .map(edge => buildHierarchy(edge.target));

    return {
      id: nodeId,
      children: children.length ? children : undefined
    };
  };

  return buildHierarchy(rootNode.id);
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
