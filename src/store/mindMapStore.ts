import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { NodeData } from '../types/node';
import { calculateNodePosition } from '../utils/nodeUtils';
import { removeNodeAndDescendants } from '../utils/nodeOperations';
import { ModelType } from '../types/models';

interface ModelConfig {
  type: ModelType;
  apiKey: string;
  geminiKey?: string;
}

interface MindMapStore {
  nodes: Node<NodeData>[];
  edges: Edge[];
  modelConfig?: ModelConfig;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  updateNodeText: (id: string, text: string) => void;
  addNode: (parentNode: Node, label: string, position: { x: number; y: number }) => Node;
  selectNode: (id: string) => void;
  saveMap: () => void;
  loadMap: () => void;
  exportAsImage: () => void;
  exportAsPDF: () => void;
  exportAsJSON: () => void;
  importFromJSON: (jsonString: string) => void;
  setModelConfig: (config: ModelConfig) => void;
}

export const useMindMapStore = create<MindMapStore>((set, get) => ({
  nodes: [],
  edges: [],
  modelConfig: undefined,
  onNodesChange: (changes) => set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
  onEdgesChange: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  onConnect: (connection) => set((state) => ({ edges: addEdge(connection, state.edges) })),
  updateNodes: (nodes) => set({ nodes }),
  updateEdges: (edges) => set({ edges }),
  updateNode: (id, data) => set((state) => ({
    nodes: state.nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, ...data } } : node
    ),
  })),
  updateNodeText: (id, text) => set((state) => ({
    nodes: state.nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, label: text } } : node
    ),
  })),
  addNode: (parentNode, label, position) => {
    const newNode: Node<NodeData> = {
      id: String(Date.now()),
      type: 'custom',
      position,
      data: { label },
    };
    set((state) => ({
      nodes: [...state.nodes, newNode],
      edges: [
        ...state.edges,
        {
          id: `e${parentNode.id}-${newNode.id}`,
          source: parentNode.id,
          target: newNode.id,
        },
      ],
    }));
    return newNode;
  },
  selectNode: (id) => set((state) => ({
    nodes: state.nodes.map((node) => ({
      ...node,
      data: { ...node.data, selected: node.id === id },
    })),
  })),
  saveMap: () => {
    const { nodes, edges } = get();
    localStorage.setItem('mindmap', JSON.stringify({ nodes, edges }));
  },
  loadMap: () => {
    const saved = localStorage.getItem('mindmap');
    if (saved) {
      const { nodes, edges } = JSON.parse(saved);
      set({ nodes, edges });
    }
  },
  exportAsImage: () => {
    // Implementation will be added in fileUtils
  },
  exportAsPDF: () => {
    // Implementation will be added in fileUtils
  },
  exportAsJSON: () => {
    const { nodes, edges } = get();
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.json';
    a.click();
    URL.revokeObjectURL(url);
  },
  importFromJSON: (jsonString) => {
    try {
      const { nodes, edges } = JSON.parse(jsonString);
      set({ nodes, edges });
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  },
  setModelConfig: (config) => set({ modelConfig: config }),
}));