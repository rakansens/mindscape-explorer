import { Node, Edge } from 'reactflow';
import { NodeData } from '../../types/node';

// 削除対象のノードとその子孫ノードのIDを収集
export const collectNodesToRemove = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  startNodeId: string
): string[] => {
  const nodesToRemove = new Set<string>([startNodeId]); // 削除対象のノード自身を追加
  const queue = [startNodeId];

  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;

    // 子ノードを見つけてキューに追加
    edges
      .filter(edge => edge.source === currentNodeId)
      .forEach(edge => {
        if (!nodesToRemove.has(edge.target)) {
          nodesToRemove.add(edge.target);
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

  const remainingNodes = nodes.filter(node => !nodeIdsSet.has(node.id));
  const remainingEdges = edges.filter(edge => 
    !nodeIdsSet.has(edge.source) && !nodeIdsSet.has(edge.target)
  );

  return {
    nodes: remainingNodes,
    edges: remainingEdges
  };
};