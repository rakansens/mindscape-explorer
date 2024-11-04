import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useViewStore } from './viewStore';

type Theme = 'light' | 'dark';

type RFState = {
  nodes: Node[];
  edges: Edge[];
  theme: Theme;
  showMinimap: boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (parentNode: Node, label: string, position?: { x: number; y: number }) => Node;
  updateNodeText: (id: string, text: string) => void;
  selectNode: (id: string) => void;
  setTheme: (theme: Theme) => void;
  toggleMinimap: () => void;
  saveMap: () => void;
  loadMap: () => void;
  exportAsImage: () => void;
  exportAsPDF: () => void;
  exportAsJSON: () => void;
  importFromJSON: (jsonString: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
};

export const useMindMapStore = create<RFState>((set, get) => ({
  nodes: [{
    id: '1',
    type: 'custom',
    data: { label: 'Main Topic' },
    position: { x: 0, y: 0 },
  }],
  edges: [],
  theme: 'light',
  showMinimap: false,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (parentNode: Node, label: string, position?: { x: number; y: number }) => {
    const newNode: Node = {
      id: uuidv4(),
      type: 'custom',
      data: { label },
      position: position || {
        x: parentNode.position.x + 250,
        y: parentNode.position.y,
      },
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: addEdge(
        {
          id: uuidv4(),
          source: parentNode.id,
          target: newNode.id,
          type: 'custom',
        },
        get().edges
      ),
    });

    return newNode;
  },

  updateNodeText: (id: string, text: string) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: text } } : node
      ),
    });
  },
  selectNode: (id: string) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, selected: true } }
          : { ...node, data: { ...node.data, selected: false } }
      ),
    });
  },
  setTheme: (theme: Theme) => {
    set({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },
  toggleMinimap: () => {
    set((state) => ({ showMinimap: !state.showMinimap }));
  },
  saveMap: () => {
    const state = {
      nodes: get().nodes,
      edges: get().edges,
    };
    localStorage.setItem('mindmap-state', JSON.stringify(state));
  },
  loadMap: () => {
    const savedState = localStorage.getItem('mindmap-state');
    if (savedState) {
      const { nodes, edges } = JSON.parse(savedState);
      set({ nodes, edges });
    }
  },
  exportAsImage: async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: null,
    });

    const link = document.createElement('a');
    link.download = 'mindmap.png';
    link.href = canvas.toDataURL();
    link.click();
  },
  exportAsPDF: async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('mindmap.pdf');
  },
  exportAsJSON: () => {
    const state = {
      nodes: get().nodes,
      edges: get().edges,
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap.json';
    link.click();
    URL.revokeObjectURL(url);
  },
  importFromJSON: (jsonString: string) => {
    try {
      const { nodes, edges } = JSON.parse(jsonString);
      set({ nodes, edges });
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  },
  updateNode: (nodeId: string, updates: Partial<Node>) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    }));
  },
}));
