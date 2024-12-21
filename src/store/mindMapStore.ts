import { create } from 'zustand';
import { Connection, applyNodeChanges, applyEdgeChanges, Edge } from 'reactflow';
import { MindMapStore, ModelConfig } from './mindmap/types';
import * as nodeOps from './mindmap/nodeOperations';
import * as fileOps from './mindmap/fileOperations';
import { v4 as uuidv4 } from 'uuid';

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

  onConnect: (connection: Connection) => {
    set((state) => ({
      edges: [
        ...state.edges,
        {
          id: uuidv4(),
          source: connection.source || '',
          target: connection.target || '',
          sourceHandle: connection.sourceHandle || undefined,
          targetHandle: connection.targetHandle || undefined,
          type: 'custom',
          animated: true
        } as Edge
      ]
    }));
  },

  updateNodes: (nodes) => set({ nodes }),
  updateEdges: (edges) => set({ edges }),

  // 個別ノードの操作
  updateNode: (id, data) => {
    set((state) => nodeOps.updateNode(state, id, data));
  },

  updateNodeText: (id, text) => {
    set((state) => nodeOps.updateNodeText(state, id, text));
  },

  addNode: (parentNode, label, position) => {
    let newNode;
    set((state) => {
      const result = nodeOps.addNode(state, parentNode, label, position);
      newNode = result.newNode;
      return {
        nodes: result.nodes,
        edges: result.edges,
      };
    });
    return newNode!;
  },

  selectNode: (id) => {
    set((state) => nodeOps.selectNode(state, id));
  },

  // ファイル操作
  saveMap: () => {
    const state = get();
    fileOps.saveMap(state);
  },

  loadMap: () => {
    const result = fileOps.loadMap();
    if (result) {
      set(result);
    }
  },

  exportAsImage: async () => {
    await fileOps.exportAsImage();
  },

  exportAsPDF: async () => {
    await fileOps.exportAsPDF();
  },

  exportAsJSON: () => {
    const state = get();
    fileOps.exportAsJSON(state);
  },

  importFromJSON: (jsonString) => {
    const result = fileOps.importFromJSON(jsonString);
    if (result) {
      set(result);
    }
  },

  // モデル設定
  setModelConfig: (config: ModelConfig) => set({ modelConfig: config }),
}));