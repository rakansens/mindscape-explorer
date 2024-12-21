import { create } from 'zustand';
import { 
  Node, 
  Edge, 
  Connection, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  NodeChange,
  EdgeChange
} from 'reactflow';
import { NodeData } from '../types/node';
import { calculateNodePosition } from '../utils/nodeUtils';
import { ModelType } from '../types/models';
import { downloadJson, downloadImage, downloadPDF } from '../utils/fileUtils';

interface ModelConfig {
  type: ModelType;
  apiKey: string;
  geminiKey?: string;
}

interface MindMapState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  modelConfig?: ModelConfig;
  selectedNodeId: string | null;
}

interface MindMapActions {
  // ノードの基本操作
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
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

type MindMapStore = MindMapState & MindMapActions;

export const useMindMapStore = create<MindMapStore>((set, get) => ({
  // 初期状態
  nodes: [],
  edges: [],
  modelConfig: undefined,
  selectedNodeId: null,

  // ノードの基本操作
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes)
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges)
    }));
  },

  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(connection, state.edges)
    }));
  },

  updateNodes: (nodes) => set({ nodes }),
  updateEdges: (edges) => set({ edges }),

  // 個別ノードの操作
  updateNode: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    }));
  },

  updateNodeText: (id, text) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: text } } : node
      ),
    }));
  },

  addNode: (parentNode, label, position) => {
    const newNode: Node<NodeData> = {
      id: String(Date.now()),
      type: 'custom',
      position,
      data: { 
        label,
        isGenerating: false,
        isAppearing: true
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      edges: [
        ...state.edges,
        {
          id: `e${parentNode.id}-${newNode.id}`,
          source: parentNode.id,
          target: newNode.id,
          type: 'custom',
          animated: true
        },
      ],
    }));

    return newNode;
  },

  selectNode: (id) => {
    set((state) => ({
      selectedNodeId: id,
      nodes: state.nodes.map((node) => ({
        ...node,
        data: { ...node.data, selected: node.id === id },
      })),
    }));
  },

  // ファイル操作
  saveMap: () => {
    const { nodes, edges } = get();
    try {
      localStorage.setItem('mindmap', JSON.stringify({ nodes, edges }));
    } catch (error) {
      console.error('Failed to save mindmap:', error);
    }
  },

  loadMap: () => {
    try {
      const saved = localStorage.getItem('mindmap');
      if (saved) {
        const { nodes, edges } = JSON.parse(saved);
        set({ nodes, edges });
      }
    } catch (error) {
      console.error('Failed to load mindmap:', error);
    }
  },

  exportAsImage: async () => {
    try {
      const element = document.querySelector('.react-flow') as HTMLElement;
      if (element) {
        await downloadImage(element, 'mindmap.png');
      }
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  },

  exportAsPDF: async () => {
    try {
      const element = document.querySelector('.react-flow') as HTMLElement;
      if (element) {
        await downloadPDF(element, 'mindmap.pdf');
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  },

  exportAsJSON: () => {
    try {
      const { nodes, edges } = get();
      downloadJson({ nodes, edges }, 'mindmap.json');
    } catch (error) {
      console.error('Failed to export JSON:', error);
    }
  },

  importFromJSON: (jsonString) => {
    try {
      const { nodes, edges } = JSON.parse(jsonString);
      set({ nodes, edges });
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  },

  // モデル設定
  setModelConfig: (config) => set({ modelConfig: config }),
}));