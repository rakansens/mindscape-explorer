import ELK from 'elkjs';
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

const elk = new ELK();

export const calculateElkLayout = async (
  nodes: Node<NodeData>[],
  edges: Edge[]
) => {
  const elkNodes = nodes.map(node => ({
    id: node.id,
    width: 200,
    height: 100,
  }));

  const elkEdges = edges.map(edge => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '100',
      'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    },
    children: elkNodes,
    edges: elkEdges,
  };

  const layout = await elk.layout(graph);

  return {
    nodes: nodes.map(node => {
      const elkNode = layout.children?.find(n => n.id === node.id);
      if (elkNode) {
        return {
          ...node,
          position: {
            x: elkNode.x || 0,
            y: elkNode.y || 0,
          },
        };
      }
      return node;
    }),
    edges,
  };
};