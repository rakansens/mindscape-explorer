import { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';

export type Theme = 'light' | 'dark';

export interface RFState {
  nodes: Node[];
  edges: Edge[];
  theme: Theme;
  showMinimap: boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (parentNode: Node, label: string) => Node;
  updateNodeText: (id: string, text: string) => void;
  selectNode: (id: string) => void;
  setTheme: (theme: Theme) => void;
  toggleMinimap: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  saveMap: () => void;
  loadMap: () => void;
  exportAsImage: () => void;
  exportAsPDF: () => void;
  exportAsJSON: () => void;
  importFromJSON: (jsonString: string) => void;
  undo: () => void;
  exitEditMode: () => void;
}