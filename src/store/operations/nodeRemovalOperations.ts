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
    // 既に訪問済みのノードはスキップ（循環参照対策）
    if (visited.has(nodeId)) return;
    
    // このノードを訪問済みとしてマーク
    visited.add(nodeId);
    nodesToRemove.add(nodeId);

    // このノードに関連するすべてのエッジを取得
    const connectedEdges = edges.filter(edge => 
      edge.source === nodeId || edge.target === nodeId
    );

    // 関連する各エッジについて処理
    connectedEdges.forEach(edge => {
      // このノードの反対側にあるノードを取得
      const nextNodeId = edge.source === nodeId ? edge.target : edge.source;
      
      // まだ訪問していないノードのみを処理
      if (!visited.has(nextNodeId)) {
        traverse(nextNodeId);
      }
    });
  };

  // 開始ノードから探索を開始
  traverse(startNodeId);
  return nodesToRemove;
};

export const removeNodesAndEdges = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodesToRemove: Set<string>
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  // 削除対象のノードを除外
  const remainingNodes = nodes.filter(node => !nodesToRemove.has(node.id));

  // 削除対象のノードに接続されているエッジを除外
  const remainingEdges = edges.filter(
    edge => !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
  );

  return {
    nodes: remainingNodes,
    edges: remainingEdges
  };
};