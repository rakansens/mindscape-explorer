import { Edge } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export const createEdge = (
  sourceId: string,
  targetId: string,
  sourceHandle?: string,
  targetHandle?: string
): Edge => {
  return {
    id: uuidv4(),
    source: sourceId,
    target: targetId,
    sourceHandle,
    targetHandle,
    type: 'custom',
    animated: true
  };
};

export const removeEdgesWithNode = (
  edges: Edge[],
  nodeId: string
): Edge[] => {
  return edges.filter(
    edge => edge.source !== nodeId && edge.target !== nodeId
  );
};

export const updateEdgeStyle = (
  edges: Edge[],
  edgeId: string,
  style: React.CSSProperties
): Edge[] => {
  return edges.map(edge =>
    edge.id === edgeId ? { ...edge, style } : edge
  );
};