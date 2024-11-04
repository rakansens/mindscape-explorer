import { Connection, Edge, Node as ReactFlowNode, NodeChange, EdgeChange } from 'reactflow';
import { ReactFlowInstance } from 'reactflow';

export type LayoutType = 'horizontal' | 'vertical' | 'radial';

export interface CopiedSubtree {
  root: ReactFlowNode;
  children: ReactFlowNode[];
}

export interface HistoryState {
  past: ReactFlowNode[][];
  present: ReactFlowNode[];
  future: ReactFlowNode[][];
}

export interface MindMapState {
  nodes: ReactFlowNode[];
  edges: Edge[];
  layout: LayoutType;
  history: HistoryState;
  isEditing: boolean;
  copiedNode: CopiedSubtree | null;
  theme: 'light' | 'dark' | 'system';
  showMinimap: boolean;
  flowInstance: ReactFlowInstance | null;
}