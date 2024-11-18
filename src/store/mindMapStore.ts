import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { ModelConfig, getDefaultModelConfig } from '../types/models';
import { NodeData } from '../types/node';
import { removeNodeAndDescendants } from './nodeOperations';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: window.innerWidth / 2 - 75, y: window.innerHeight / 3 },
    data: { 
      label: 'メインテーマ',
      selected: false,
      isGenerating: false,
      isAppearing: false
    }
  }
];

const initialModelConfig = getDefaultModelConfig();

interface MindMapStore {
  nodes: Node<NodeData>[];
  edges: Edge[];
  modelConfig: ModelConfig | null;
  setModelConfig: (config: ModelConfig | null) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
  selectNode: (id: string) => void;
  updateNodeText: (id: string, text: string) => void;
  addNode: (parentNode: Node<NodeData>, label: string, position?: { x: number; y: number }, additionalData?: Partial<NodeData>) => Node<NodeData>;
  updateNode: (id: string, updates: Partial<NodeData>) => void;
  removeChildNodes: (nodeId: string) => void;
  exportAsImage: () => Promise<void>;
  exportAsPDF: () => Promise<void>;
  exportAsJSON: () => void;
  importFromJSON: (jsonString: string) => void;
  saveMap: () => void;
  loadMap: () => void;
}

export const useMindMapStore = create<MindMapStore>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  modelConfig: initialModelConfig,

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
      edges: [
        ...state.edges,
        {
          ...connection,
          id: `e${connection.source}-${connection.target}`,
          type: 'custom',
        }
      ]
    }));
  },

  updateNodes: (nodes) => set({ nodes }),
  updateEdges: (edges) => set({ edges }),

  selectNode: (id) => {
    set((state) => ({
      nodes: state.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          selected: node.id === id
        }
      }))
    }));
  },

  updateNodeText: (id, text) => {
    set((state) => ({
      nodes: state.nodes.map(node =>
        node.id === id ? { ...node, data: { ...node.data, label: text } } : node
      )
    }));
  },

  addNode: (parentNode, label, position, additionalData = {}) => {
    const newNode: Node<NodeData> = {
      id: nanoid(),
      type: 'custom',
      position: position || { x: 0, y: 0 },
      data: {
        label,
        isGenerating: false,
        isAppearing: false,
        selected: false,
        ...additionalData
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      edges: parentNode
        ? [...state.edges, {
            id: `${parentNode.id}-${newNode.id}`,
            source: parentNode.id,
            target: newNode.id,
          }]
        : state.edges,
    }));

    return newNode;
  },

  updateNode: (id, updates) => {
    set((state) => ({
      nodes: state.nodes.map(node =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...updates
              }
            }
          : node
      )
    }));
  },

  removeChildNodes: (nodeId) => {
    set((state) => {
      const { nodes, edges } = removeNodeAndDescendants(state.nodes, state.edges, nodeId);
      return { nodes, edges };
    });
  },

  exportAsImage: async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (element) {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'mindmap.png';
      link.href = dataUrl;
      link.click();
    }
  },

  exportAsPDF: async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('mindmap.pdf');
    }
  },

  exportAsJSON: () => {
    const { nodes, edges } = get();
    const data = { nodes, edges };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap.json';
    link.click();
    URL.revokeObjectURL(url);
  },

  importFromJSON: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.nodes && data.edges) {
        set({ nodes: data.nodes, edges: data.edges });
      }
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  },

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

  setModelConfig: (config) => set({ modelConfig: config }),
}));
