import { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';

export interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export interface MindMapState {
  nodes: Node[];
  edges: Edge[];
  theme: 'light' | 'dark';
  showMinimap: boolean;
  history: HistoryState[];
  currentHistoryIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

export interface MindMapActions {
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (parentNode: Node, label: string, position?: { x: number; y: number }) => Node;
  updateNodeText: (id: string, text: string) => void;
  selectNode: (id: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleMinimap: () => void;
  saveMap: () => void;
  loadMap: () => void;
  exportAsImage: () => void;
  exportAsPDF: () => void;
  exportAsJSON: () => void;
  importFromJSON: (jsonString: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  removeChildNodes: (nodeId: string) => void;
  undo: () => void;
  redo: () => void;
  addToHistory: (state: MindMapState) => void;
}

export type MindMapStore = MindMapState & MindMapActions;