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
    
    console.log(`[Traverse] Marking node ${nodeId} for removal`);
    visited.add(nodeId);
    nodesToRemove.add(nodeId);

    // 子ノードを特定するためのエッジを取得
    const childEdges = edges.filter(edge => edge.source === nodeId);
    console.log(`[Traverse] Found child edges:`, childEdges);

    // 各子ノードを再帰的に処理
    childEdges.forEach(edge => {
      const childNodeId = edge.target;
      console.log(`[Traverse] Processing child: ${childNodeId}`);
      traverse(childNodeId);
    });
  };

  traverse(startNodeId);
  console.log(`[FindDescendants] Nodes to remove:`, Array.from(nodesToRemove));
  return nodesToRemove;
};

export const removeNodesAndEdges = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodesToRemove: Set<string>
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  console.log(`[Remove] Starting removal of ${nodesToRemove.size} nodes`);
  console.log(`[Remove] Initial nodes:`, nodes.map(n => n.id));
  console.log(`[Remove] Initial edges:`, edges.map(e => `${e.source}->${e.target}`));

  // 削除対象外のノードのみを残す
  const remainingNodes = nodes.filter(node => !nodesToRemove.has(node.id));
  
  // 削除対象のノードに接続されているエッジを除外
  const remainingEdges = edges.filter(edge => 
    !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
  );

  console.log(`[Remove] Remaining nodes:`, remainingNodes.map(n => n.id));
  console.log(`[Remove] Remaining edges:`, remainingEdges.map(e => `${e.source}->${e.target}`));

  return {
    nodes: remainingNodes,
    edges: remainingEdges
  };
};