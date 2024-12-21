import { Node, Edge } from 'reactflow';
import { NodeData } from '../../types/node';
import * as d3Hierarchy from 'd3-hierarchy';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

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
  
  const hierarchyData = createHierarchyData(nodes, edges);
  const root = d3Hierarchy.hierarchy(hierarchyData);

  const treeLayout = d3Hierarchy.tree<any>()
    .nodeSize([NODE_HEIGHT + (options.nodeSpacing || 100), NODE_WIDTH + (options.rankSpacing || 200)]);

  treeLayout(root);

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