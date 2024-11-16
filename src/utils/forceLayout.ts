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
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2).strength(0.1))
    .force('collision', d3.forceCollide().radius(80))
    .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(150));

  for (let i = 0; i < 300; i++) {
    simulation.tick();
  }

  const updatedNodes = nodes.map(node => ({
    ...node,
    position: {
      x: Math.max(0, Math.min(width - 200, (node as any).x)),
      y: Math.max(0, Math.min(height - 100, (node as any).y))
    }
  }));

  simulation.stop();

  // 元のエッジの属性を保持
  const updatedEdges = edges.map(originalEdge => ({
    ...originalEdge,
    type: originalEdge.type || 'custom',
    animated: true,
    sourceHandle: originalEdge.sourceHandle,
    targetHandle: originalEdge.targetHandle
  }));

  return {
    nodes: updatedNodes,
    edges: updatedEdges
  };
};