import { Node, Edge } from 'reactflow';
import { NodeData } from '../../types/node';
import * as d3Hierarchy from 'd3-hierarchy';

const PADDING = 100;

export const getRadialLayout = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  width: number,
  height: number
) => {
  if (!nodes.length) return { nodes, edges };

  const hierarchyData = createHierarchyData(nodes, edges);
  const root = d3Hierarchy.hierarchy(hierarchyData);

  const radius = Math.min(width, height) / 2 - PADDING;
  
  const radialLayout = d3Hierarchy.tree<any>()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

  radialLayout(root);

  const centerX = width / 2;
  const centerY = height / 2;

  const layoutedNodes = nodes.map(node => {
    const hierarchyNode = root.find(d => d.data.id === node.id);
    if (!hierarchyNode) return node;

    const x = centerX + hierarchyNode.y * Math.cos(hierarchyNode.x - Math.PI / 2);
    const y = centerY + hierarchyNode.y * Math.sin(hierarchyNode.x - Math.PI / 2);

    return {
      ...node,
      position: { x, y }
    };
  });

  return { nodes: layoutedNodes, edges };
};

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