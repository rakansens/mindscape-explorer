import { Node, Edge } from 'reactflow';
import { NodeData } from '../../types/node';

export const findDescendantNodes = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  startNodeId: string,
  visited = new Set<string>()
): Set<string> => {
  const nodesToRemove = new Set<string>();
  
  const traverse = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    nodesToRemove.add(nodeId);

    // Find all edges where this node is the source
    edges
      .filter(edge => edge.source === nodeId)
      .forEach(edge => {
        traverse(edge.target);
      });
  };

  traverse(startNodeId);
  return nodesToRemove;
};

export const removeNodesAndEdges = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodesToRemove: Set<string>
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const remainingNodes = nodes.filter(node => !nodesToRemove.has(node.id));
  const remainingEdges = edges.filter(
    edge => !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
  );

  return {
    nodes: remainingNodes,
    edges: remainingEdges
  };
};