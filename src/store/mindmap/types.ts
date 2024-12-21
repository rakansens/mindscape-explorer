import { Node, Edge, Connection } from 'reactflow';
import { NodeData } from '../../types/node';
import { ModelConfig } from '../../types/models';

export interface MindMapState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  modelConfig?: ModelConfig;
  selectedNodeId: string | null;
}

export interface MindMapActions {
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  updateNodeText: (id: string, text: string) => void;
  addNode: (parentNode: Node, label: string, position: { x: number; y: number }) => Node;
  selectNode: (id: string) => void;
  saveMap: () => void;
  loadMap: () => void;
  exportAsImage: () => Promise<void>;
  exportAsPDF: () => Promise<void>;
  exportAsJSON: () => void;
  importFromJSON: (jsonString: string) => void;
  setModelConfig: (config: ModelConfig) => void;
}

export type MindMapStore = MindMapState & MindMapActions;