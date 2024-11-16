import { Node, Edge } from 'reactflow';
import * as d3 from 'd3-force';
import { NodeData } from '../types/node';

export const applyForceLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  width: number = window.innerWidth,
  height: number = window.innerHeight
) => {
  const simulation = d3.forceSimulation(nodes as any)
    // 力の強さを調整（-1000から-300に変更）
    .force('charge', d3.forceManyBody().strength(-300))
    // 中心への引力を強化
    .force('center', d3.forceCenter(width / 2, height / 2).strength(0.1))
    // ノード間の衝突回避範囲を調整
    .force('collision', d3.forceCollide().radius(80))
    // リンクの距離を短く調整（200から150に変更）
    .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(150));

  // シミュレーションの反復回数を増やす（100から300に変更）
  for (let i = 0; i < 300; i++) {
    simulation.tick();
  }

  // ノードの位置を更新
  const updatedNodes = nodes.map(node => ({
    ...node,
    position: {
      x: Math.max(0, Math.min(width - 200, (node as any).x)),
      y: Math.max(0, Math.min(height - 100, (node as any).y))
    }
  }));

  // シミュレーションを停止
  simulation.stop();

  return {
    nodes: updatedNodes,
    edges: edges.map(edge => ({
      ...edge,
      type: 'custom',
      animated: true
    }))
  };
};