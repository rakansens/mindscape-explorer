import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

export const removeNodeAndDescendants = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodeId: string
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const nodesToRemove = new Set<string>();
  
  const collectDescendantIds = (currentId: string) => {
    nodesToRemove.add(currentId);
    
    // Find all child edges for the current node
    edges.forEach(edge => {
      if (edge.source === currentId && !nodesToRemove.has(edge.target)) {
        collectDescendantIds(edge.target);
      }
    });
  };

  // Start collecting from the initial node
  collectDescendantIds(nodeId);

  // Remove all collected nodes and their associated edges
  return {
    nodes: nodes.filter(node => !nodesToRemove.has(node.id)),
    edges: edges.filter(edge => 
      !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
    )
  };
};