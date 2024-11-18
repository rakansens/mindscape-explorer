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
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    nodesToRemove.add(nodeId);

    // 両方向のエッジを探索
    edges
      .filter(edge => 
        // sourceからtargetとtargetからsourceの両方向を確認
        edge.source === nodeId || edge.target === nodeId
      )
      .forEach(edge => {
        // エッジの反対側のノードを探索
        const nextNodeId = edge.source === nodeId ? edge.target : edge.source;
        traverse(nextNodeId);
      });
  };

  traverse(startNodeId);
  return nodesToRemove;
};

export const removeNodesAndEdges = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodesToRemove: Set<string>
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const remainingNodes = nodes.filter(node => !nodesToRemove.has(node.id));
  const remainingEdges = edges.filter(
    edge => !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
  );

  return {
    nodes: remainingNodes,
    edges: remainingEdges
  };
};