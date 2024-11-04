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
import { MindMapStore, MindMapState } from './types/mindMapTypes';
import { handleExport } from './utils/exportUtils';
import { handleHistory } from './utils/historyUtils';

const MAX_HISTORY_LENGTH = 100;

const initialState: MindMapState = {
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
};

export const useMindMapStore = create<MindMapStore>((set, get) => ({
  ...initialState,

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

  undo: () => handleHistory.undo(set, get),
  redo: () => handleHistory.redo(set, get),

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
  
  exportAsImage: () => handleExport.asImage(),
  
  exportAsPDF: () => handleExport.asPDF(),
  
  exportAsJSON: () => handleExport.asJSON(get),
  
  importFromJSON: (jsonString: string) => handleExport.fromJSON(jsonString, set),

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
