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
    .force('charge', d3.forceManyBody().strength(-1000))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(100))
    .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(200));

  // Run the simulation synchronously
  for (let i = 0; i < 100; i++) {
    simulation.tick();
  }

  // Update node positions based on simulation
  const updatedNodes = nodes.map(node => ({
    ...node,
    position: {
      x: (node as any).x,
      y: (node as any).y
    }
  }));

  // Stop the simulation
  simulation.stop();

  return {
    nodes: updatedNodes,
    edges: edges
  };
};