import { create } from 'zustand';
import { Connection, Edge, EdgeChange, Node as ReactFlowNode, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { MindMapState } from './types/mindMapTypes';
import { createNodeSlice } from './slices/nodeSlice';
import { createLayoutSlice } from './slices/layoutSlice';
import { createExportSlice } from './slices/exportSlice';
import { HORIZONTAL_SPACING, VERTICAL_SPACING } from './constants/layoutConstants';

const initialState: MindMapState = {
  nodes: [
    {
      id: '1',
      type: 'mindNode',
      data: { label: 'Central Topic' },
      position: { x: window.innerWidth / 2, y: window.innerHeight / 3 },
    },
  ],
  edges: [],
  layout: 'horizontal',
  history: {
    past: [],
    present: [],
    future: [],
  },
  isEditing: false,
  copiedNode: null,
  theme: 'light',
  showMinimap: false,
  flowInstance: null,
  
  // These will be overwritten by the slices
  addNode: () => ({ id: '', type: '', data: {}, position: { x: 0, y: 0 } }),
  updateNodeText: () => {},
  updateNodePosition: () => {},
  updateNodeColor: () => {},
  deleteNode: () => {},
  toggleCollapse: () => {},
  selectNode: () => {},
  onNodesChange: () => {},
  onEdgesChange: () => {},
  onConnect: () => {},
  setFlowInstance: () => {},
  setLayout: () => {},
  calculateLayout: () => {},
  zoomIn: () => {},
  zoomOut: () => {},
  fitView: () => {},
  setTheme: () => {},
  toggleMinimap: () => {},
  saveMap: () => {},
  loadMap: () => {},
  exportAsImage: async () => {},
  exportAsPDF: async () => {},
  exportAsJSON: () => {},
  importFromJSON: () => {},
  autoSave: () => {},
};

export const useMindMapStore = create<MindMapState>((set, get) => ({
  ...initialState,
  ...createNodeSlice(set, get),
  ...createLayoutSlice(set, get),
  ...createExportSlice(set, get),

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

  setFlowInstance: (instance: ReactFlowInstance) => {
    set({ flowInstance: instance });
  },

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    set({ theme });
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },

  toggleMinimap: () => {
    set((state) => ({ showMinimap: !state.showMinimap }));
  },

  zoomIn: () => {
    const { flowInstance } = get();
    if (!flowInstance) return;
    flowInstance.zoomIn({ duration: 300 });
  },

  zoomOut: () => {
    const { flowInstance } = get();
    if (!flowInstance) return;
    flowInstance.zoomOut({ duration: 300 });
  },

  fitView: () => {
    const { flowInstance } = get();
    if (!flowInstance) return;
    flowInstance.fitView({ duration: 300, padding: 0.2 });
  },
}));

// 自動保存の設定
if (typeof window !== 'undefined') {
  setInterval(() => {
    useMindMapStore.getState().autoSave();
  }, 60000);
}