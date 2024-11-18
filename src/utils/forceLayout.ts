import { Node, Edge } from 'reactflow';
import * as d3 from 'd3-force';
import { NodeData } from '../types/node';

const PADDING = 100; // 画面端からの余白

export const applyForceLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  width: number = window.innerWidth,
  height: number = window.innerHeight
) => {
  if (!nodes.length) return { nodes, edges };

  // ノードとエッジのコピーを作成
  const nodesCopy = nodes.map(node => ({ ...node }));
  const edgesCopy = edges.map(edge => ({ ...edge }));

  // 親ノード（id: "1"）を中心に配置
  const parentNode = nodesCopy.find(node => node.id === "1");
  if (parentNode) {
    (parentNode as any).fx = width / 2;  // x位置を固定
    (parentNode as any).fy = height / 2; // y位置を固定
  }

  // シミュレーション用のデータ構造を作成
  const simulation = d3.forceSimulation(nodesCopy as any)
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2).strength(0.1))
    .force('collision', d3.forceCollide().radius(100))
    .force('link', d3.forceLink(edgesCopy).id((d: any) => d.id).distance(150));

  // シミュレーションを実行
  for (let i = 0; i < 300; i++) {
    simulation.tick();
  }

  // 新しい位置を元のノードに適用（画面内に収まるように制限）
  const updatedNodes = nodes.map((originalNode, i) => ({
    ...originalNode,
    position: {
      x: Math.max(PADDING, Math.min(width - PADDING, (nodesCopy[i] as any).x)),
      y: Math.max(PADDING, Math.min(height - PADDING, (nodesCopy[i] as any).y))
    }
  }));

  simulation.stop();

  return {
    nodes: updatedNodes,
    edges: edges.map(originalEdge => ({
      ...originalEdge,
      id: originalEdge.id,
      source: originalEdge.source,
      target: originalEdge.target,
      type: originalEdge.type || 'custom',
      animated: true,
      sourceHandle: originalEdge.sourceHandle,
      targetHandle: originalEdge.targetHandle,
      style: originalEdge.style
    }))
  };
};