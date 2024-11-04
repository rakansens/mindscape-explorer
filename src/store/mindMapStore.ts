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
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

interface MindMapState {
  nodes: Node[];
  edges: Edge[];
  theme: 'light' | 'dark';
  showMinimap: boolean;
  history: HistoryState[];
  currentHistoryIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

interface MindMapActions {
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

type MindMapStore = MindMapState & MindMapActions;

const MAX_HISTORY_LENGTH = 100;

export const useMindMapStore = create<MindMapStore>((set, get) => ({
  nodes: [{
    id: '1',
    type: 'custom',
    data: { label: 'Main Topic' },
    position: { x: 0, y: 0 },
  }],
  edges: [],
  theme: 'light',
  showMinimap: false,
  history: [],
  currentHistoryIndex: -1,
  canUndo: false,
  canRedo: false,

  addToHistory: (state: MindMapState) => {
    const { history, currentHistoryIndex } = get();
    const newHistory = [...history.slice(0, currentHistoryIndex + 1), { nodes: state.nodes, edges: state.edges }];
    
    if (newHistory.length > MAX_HISTORY_LENGTH) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      currentHistoryIndex: newHistory.length - 1,
      canUndo: newHistory.length > 1,
      canRedo: false,
    });
  },

  // Undo機能
  undo: () => {
    const { history, currentHistoryIndex } = get();
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const previousState = history[newIndex];
      set({
        nodes: previousState.nodes,
        edges: previousState.edges,
        currentHistoryIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
      });
    }
  },

  // Redo機能
  redo: () => {
    const { history, currentHistoryIndex } = get();
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const nextState = history[newIndex];
      set({
        nodes: nextState.nodes,
        edges: nextState.edges,
        currentHistoryIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < history.length - 1,
      });
    }
  },

  onNodesChange: (changes: NodeChange[]) => {
    const newNodes = applyNodeChanges(changes, get().nodes);
    set({ nodes: newNodes });
    get().addToHistory({ ...get(), nodes: newNodes });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const newEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: newEdges });
    get().addToHistory({ ...get(), edges: newEdges });
  },

  onConnect: (connection: Connection) => {
    const newEdges = addEdge(connection, get().edges);
    set({ edges: newEdges });
    get().addToHistory({ ...get(), edges: newEdges });
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

    get().addToHistory({ ...get(), nodes: [...get().nodes, newNode] });
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
  setTheme: (theme: 'light' | 'dark') => {
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

  removeChildNodes: (nodeId: string) => {
    const edges = get().edges;
    const nodes = get().nodes;
    
    // 子ノードのIDを再帰的に収集
    const getChildNodeIds = (parentId: string, collected: Set<string> = new Set()): Set<string> => {
      edges.forEach(edge => {
        if (edge.source === parentId) {
          collected.add(edge.target);
          getChildNodeIds(edge.target, collected);
        }
      });
      return collected;
    };

    const childNodeIds = getChildNodeIds(nodeId);
    
    set({
      nodes: nodes.filter(node => !childNodeIds.has(node.id)),
      edges: edges.filter(edge => !childNodeIds.has(edge.target) && !childNodeIds.has(edge.source))
    });
  },
}));
