import { Node, Edge, Connection } from 'reactflow';
import { NodeData } from '../../types/node';
import { ModelType } from '../../types/models';

export interface ModelConfig {
  type: ModelType;
  apiKey: string;
  geminiKey?: string;
}

export interface MindMapState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  modelConfig?: ModelConfig;
  selectedNodeId: string | null;
}

export interface MindMapActions {
  // ノードの基本操作
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
  
  // 個別ノードの操作
  updateNode: (id: string, data: Partial<NodeData>) => void;
  updateNodeText: (id: string, text: string) => void;
  addNode: (parentNode: Node, label: string, position: { x: number; y: number }) => Node;
  selectNode: (id: string) => void;
  
  // ファイル操作
  saveMap: () => void;
  loadMap: () => void;
  exportAsImage: () => void;
  exportAsPDF: () => void;
  exportAsJSON: () => void;
  importFromJSON: (jsonString: string) => void;
  
  // モデル設定
  setModelConfig: (config: ModelConfig) => void;
}

export type MindMapStore = MindMapState & MindMapActions;