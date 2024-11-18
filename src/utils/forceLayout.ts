import { Node, Edge } from 'reactflow';
import * as d3 from 'd3-force';
import { NodeData } from '../types/node';

const PADDING = 50; // パディング値を100から50に減少

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

  // 親ノードを中心に固定
  const centerX = width / 2;
  const centerY = height / 2;

  // シミュレーション用のデータ構造を作成
  const simulation = d3.forceSimulation(nodesCopy as any)
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(centerX, centerY))
    .force('collision', d3.forceCollide().radius(80))
    .force('link', d3.forceLink(edgesCopy).id((d: any) => d.id).distance(120));

  // シミュレーションを実行
  for (let i = 0; i < 300; i++) {
    simulation.tick();
  }

  // 親ノードを中心に配置（シミュレーション後に適用）
  const parentNode = nodesCopy.find(node => node.id === "1");
  if (parentNode) {
    (parentNode as any).x = centerX;
    (parentNode as any).y = centerY;
  }

  // 新しい位置を元のノードに適用（画面内に収まるように制限）
  const updatedNodes = nodes.map((originalNode, i) => {
    const node = nodesCopy[i];
    // 親ノードの場合は中心位置を維持
    if (originalNode.id === "1") {
      return {
        ...originalNode,
        position: {
          x: centerX - 100,
          y: centerY - 50
        }
      };
    }
    // その他のノードは画面内に収める
    return {
      ...originalNode,
      position: {
        x: Math.max(PADDING, Math.min(width - PADDING - 200, (node as any).x - 100)),
        y: Math.max(PADDING, Math.min(height - PADDING - 100, (node as any).y - 50))
      }
    };
  });

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