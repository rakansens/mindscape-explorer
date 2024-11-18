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
    edges.forEach(edge => {
      if (edge.source === parentId) {
        collectDescendantIds(edge.target);
      }
    });
  };

  // 指定されたノードとその子孫を収集
  collectDescendantIds(nodeId);

  // 削除対象のノードとそれに関連するエッジを除外
  return {
    nodes: nodes.filter(node => !nodesToRemove.has(node.id)),
    edges: edges.filter(edge => 
      !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
    )
  };
};