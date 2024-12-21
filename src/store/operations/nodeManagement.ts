import { Node, Edge } from 'reactflow';
import { NodeData } from '../../types/node';

export const addNode = (nodes: Node<NodeData>[], newNode: Node<NodeData>): Node<NodeData>[] => {
  return [...nodes, newNode];
};

export const updateNode = (nodes: Node<NodeData>[], updatedNode: Node<NodeData>): Node<NodeData>[] => {
  return nodes.map(node => (node.id === updatedNode.id ? updatedNode : node));
};

export const removeNode = (nodes: Node<NodeData>[], edges: Edge[], nodeId: string): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const nodesToRemove = new Set<string>();
  
  const collectDescendantIds = (currentNodeId: string, visited = new Set<string>()) => {
    if (visited.has(currentNodeId)) return;
    
    visited.add(currentNodeId);
    nodesToRemove.add(currentNodeId);

    edges.forEach(edge => {
      if (edge.source === currentNodeId) {
        collectDescendantIds(edge.target, visited);
      }
    });
  };

  collectDescendantIds(nodeId);

  const filteredNodes = nodes.filter(node => !nodesToRemove.has(node.id));
  const filteredEdges = edges.filter(edge => 
    !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges
  };
};
