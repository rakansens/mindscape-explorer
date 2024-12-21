import { create } from 'zustand';
import { Connection, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { MindMapStore } from './mindmap/types';
import { createEdge } from '../utils/edgeManagement';
import { addNodeWithPosition, updateNodeWithData } from '../utils/nodeManagement';
import * as fileOps from './mindmap/fileOperations';

export const useMindMapStore = create<MindMapStore>((set, get) => ({
  nodes: [],
  edges: [],
  modelConfig: undefined,
  selectedNodeId: null,

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
    if (!connection.source || !connection.target) return;
    
    set((state) => ({
      edges: [
        ...state.edges,
        createEdge(
          connection.source,
          connection.target,
          connection.sourceHandle,
          connection.targetHandle
        )
      ]
    }));
  },

  updateNodes: (nodes) => set({ nodes }),
  updateEdges: (edges) => set({ edges }),

  updateNode: (id, data) => {
    set((state) => ({
      nodes: updateNodeWithData(state.nodes, id, data)
    }));
  },

  updateNodeText: (id, text) => {
    set((state) => ({
      nodes: updateNodeWithData(state.nodes, id, { label: text })
    }));
  },

  addNode: (parentNode, label, position) => {
    let newNode;
    set((state) => {
      newNode = addNodeWithPosition(state.nodes, parentNode, label, position);
      return {
        nodes: [...state.nodes, newNode],
        edges: [
          ...state.edges,
          createEdge(parentNode.id, newNode.id)
        ]
      };
    });
    return newNode!;
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

  // ファイル操作関連のメソッドは既存のものを維持
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

  setModelConfig: (config) => set({ modelConfig: config }),
}));