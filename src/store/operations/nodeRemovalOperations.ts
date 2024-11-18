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
    console.log(`[Traverse] Current visited nodes:`, Array.from(visited));
    console.log(`[Traverse] Current nodes to remove:`, Array.from(nodesToRemove));
    
    if (visited.has(nodeId)) {
      console.log(`[Traverse] Node ${nodeId} already visited, skipping`);
      return;
    }
    
    console.log(`[Traverse] Marking node ${nodeId} as visited and for removal`);
    visited.add(nodeId);
    nodesToRemove.add(nodeId);

    // このノードから出ているエッジのみを取得（子ノードへの接続）
    const childEdges = edges.filter(edge => edge.source === nodeId);
    
    console.log(`[Traverse] Found ${childEdges.length} child edges for node ${nodeId}:`, 
      childEdges.map(edge => `${edge.source}->${edge.target}`));

    // 子ノードのみを処理
    childEdges.forEach(edge => {
      const childNodeId = edge.target;
      console.log(`[Traverse] Processing child node: ${childNodeId}`);
      
      if (!visited.has(childNodeId)) {
        console.log(`[Traverse] Traversing to child node: ${childNodeId}`);
        traverse(childNodeId);
      } else {
        console.log(`[Traverse] Child node ${childNodeId} already visited, skipping`);
      }
    });
  };

  console.log(`[FindDescendants] Starting traversal from node: ${startNodeId}`);
  console.log(`[FindDescendants] Initial edges:`, edges.map(edge => `${edge.source}->${edge.target}`));
  traverse(startNodeId);
  console.log(`[FindDescendants] Final nodes marked for removal:`, Array.from(nodesToRemove));
  return nodesToRemove;
};

export const removeNodesAndEdges = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodesToRemove: Set<string>
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  console.log(`[Remove] Starting removal process for ${nodesToRemove.size} nodes`);
  console.log(`[Remove] Nodes to remove:`, Array.from(nodesToRemove));
  console.log(`[Remove] Initial nodes:`, nodes.map(node => node.id));
  console.log(`[Remove] Initial edges:`, edges.map(edge => `${edge.source}->${edge.target}`));
  
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