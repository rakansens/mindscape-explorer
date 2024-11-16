import { Node, Edge } from 'reactflow';
import * as d3 from 'd3-force';
import { NodeData } from '../types/node';

export const applyForceLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  width: number = window.innerWidth,
  height: number = window.innerHeight
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