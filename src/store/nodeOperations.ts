import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

export const removeNodeAndDescendants = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodeId: string
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const nodesToRemove = new Set<string>();
  
  // 再帰的に全ての子孫ノードのIDを収集
  const collectDescendantIds = (parentId: string) => {
    nodesToRemove.add(parentId);
    
    // このノードを起点とするすべてのエッジを検索
    const childEdges = edges.filter(edge => edge.source === parentId);
    
    // 各子ノードに対して再帰的に処理
    childEdges.forEach(edge => {
      if (!nodesToRemove.has(edge.target)) {
        collectDescendantIds(edge.target);
      }
    });
  };

  // 指定されたノードとその子孫を収集
  collectDescendantIds(nodeId);

  // 削除対象のノードとそれに関連するエッジを除外
  const filteredNodes = nodes.filter(node => !nodesToRemove.has(node.id));
  const filteredEdges = edges.filter(edge => 
    !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges
  };
};