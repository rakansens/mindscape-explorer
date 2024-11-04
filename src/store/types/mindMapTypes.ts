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
  
  // Node operations
  addNode: (parentNode: ReactFlowNode | null, label: string, index?: number, totalSiblings?: number) => ReactFlowNode;
  updateNodeText: (id: string, text: string, withAnimation?: boolean) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  updateNodeColor: (nodeId: string, color: string) => void;
  deleteNode: (nodeId: string) => void;
  toggleCollapse: (nodeId: string) => void;
  selectNode: (nodeId: string) => void;
  
  // Flow operations
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setFlowInstance: (instance: ReactFlowInstance) => void;
  
  // Layout operations
  setLayout: (layout: LayoutType) => void;
  calculateLayout: () => void;
  
  // View controls
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleMinimap: () => void;
  
  // Import/Export operations
  saveMap: () => void;
  loadMap: () => void;
  exportAsImage: () => Promise<void>;
  exportAsPDF: () => Promise<void>;
  exportAsJSON: () => void;
  importFromJSON: (jsonData: string) => void;
  autoSave: () => void;
}