import { create } from 'zustand';
import { Connection, Edge, Node, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { NodeData } from '../types/node';
import { ModelConfig } from '../types/models';
import { addNodeWithPosition, updateNodeWithData } from '../utils/nodeOperations';
import { createEdge } from '../utils/edgeOperations';
import * as fileOps from './mindmap/fileOperations';

interface MindMapState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  modelConfig?: ModelConfig;
  selectedNodeId: string | null;
}

interface MindMapActions {
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  updateNodeText: (id: string, text: string) => void;
  addNode: (parentNode: Node, label: string, position: { x: number; y: number }) => Node;
  selectNode: (id: string) => void;
  saveMap: () => void;
  loadMap: () => void;
  exportAsImage: () => Promise<void>;
  exportAsPDF: () => Promise<void>;
  exportAsJSON: () => void;
  importFromJSON: (jsonString: string) => void;
  setModelConfig: (config: ModelConfig) => void;
}

type MindMapStore = MindMapState & MindMapActions;

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