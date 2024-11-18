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
    console.log(`[Traverse] Processing node: ${nodeId}`);
    
    if (visited.has(nodeId)) {
      console.log(`[Traverse] Node ${nodeId} already visited, skipping`);
      return;
    }
    
    console.log(`[Traverse] Marking node ${nodeId} as visited`);
    visited.add(nodeId);
    nodesToRemove.add(nodeId);

    const connectedEdges = edges.filter(edge => 
      edge.source === nodeId || edge.target === nodeId
    );
    
    console.log(`[Traverse] Found ${connectedEdges.length} connected edges for node ${nodeId}:`, 
      connectedEdges.map(edge => `${edge.source}->${edge.target}`));

    connectedEdges.forEach(edge => {
      const nextNodeId = edge.source === nodeId ? edge.target : edge.source;
      console.log(`[Traverse] Next node to process: ${nextNodeId} (from edge ${edge.source}->${edge.target})`);
      
      if (!visited.has(nextNodeId)) {
        traverse(nextNodeId);
      } else {
        console.log(`[Traverse] Next node ${nextNodeId} already visited, skipping`);
      }
    });
  };

  console.log(`[FindDescendants] Starting traversal from node: ${startNodeId}`);
  traverse(startNodeId);
  console.log(`[FindDescendants] Nodes marked for removal:`, Array.from(nodesToRemove));
  return nodesToRemove;
};

export const removeNodesAndEdges = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodesToRemove: Set<string>
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  console.log(`[Remove] Starting removal process for ${nodesToRemove.size} nodes`);
  console.log(`[Remove] Nodes to remove:`, Array.from(nodesToRemove));
  
  const remainingNodes = nodes.filter(node => !nodesToRemove.has(node.id));
  console.log(`[Remove] Remaining nodes: ${remainingNodes.length}`, 
    remainingNodes.map(node => node.id));

  const remainingEdges = edges.filter(
    edge => !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
  );
  console.log(`[Remove] Remaining edges: ${remainingEdges.length}`, 
    remainingEdges.map(edge => `${edge.source}->${edge.target}`));

  return {
    nodes: remainingNodes,
    edges: remainingEdges
  };
};