import { Node, Edge } from 'reactflow';
import { NodeData } from '../../types/node';

// 子孫ノードを含むすべての削除対象ノードを収集
export const collectNodesToRemove = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  startNodeId: string
): string[] => {
  const nodesToRemove = new Set<string>();
  const queue = [startNodeId];

  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    nodesToRemove.add(currentNodeId);

    // 現在のノードの子ノードを見つけてキューに追加
    edges
      .filter(edge => edge.source === currentNodeId)
      .forEach(edge => {
        if (!nodesToRemove.has(edge.target)) {
          queue.push(edge.target);
        }
      });
  }

  return Array.from(nodesToRemove);
};

// ノードとそれに関連するエッジを削除
export const removeNodesAndEdges = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodeIdsToRemove: string[]
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const nodeIdsSet = new Set(nodeIdsToRemove);

  return {
    nodes: nodes.filter(node => !nodeIdsSet.has(node.id)),
    edges: edges.filter(edge => 
      !nodeIdsSet.has(edge.source) && !nodeIdsSet.has(edge.target)
    )
  };
};