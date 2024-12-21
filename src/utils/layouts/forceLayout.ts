import { Node, Edge } from 'reactflow';
import { NodeData } from '../../types/node';
import * as d3Force from 'd3-force';

export const applyForceLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  width: number,
  height: number
) => {
  if (!nodes.length) return { nodes, edges };

  const nodesCopy = nodes.map(node => ({ ...node }));
  const edgesCopy = edges.map(edge => ({ ...edge }));

  const simulation = d3Force.forceSimulation(nodesCopy as any)
    .force('charge', d3Force.forceManyBody().strength(-300))
    .force('center', d3Force.forceCenter(width / 2, height / 2).strength(0.1))
    .force('collision', d3Force.forceCollide().radius(80))
    .force('link', d3Force.forceLink(edgesCopy).id((d: any) => d.id).distance(150));

  for (let i = 0; i < 300; i++) {
    simulation.tick();
  }

  const updatedNodes = nodes.map((originalNode, i) => ({
    ...originalNode,
    position: {
      x: Math.max(0, Math.min(width - 200, (nodesCopy[i] as any).x)),
      y: Math.max(0, Math.min(height - 100, (nodesCopy[i] as any).y))
    }
  }));

  simulation.stop();

  return {
    nodes: updatedNodes,
    edges
  };
};