import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { ModelConfig, getDefaultModelConfig } from '../types/models';
import { NodeData } from '../types/node';
import { collectNodesToRemove, removeNodesAndEdges } from './operations/nodeOperations';
import {
  addNodeOperation,
  updateNodeOperation,
  selectNodeOperation,
} from './operations/nodeManagement';
import {
  exportAsImageOperation,
  exportAsPDFOperation,
  exportAsJSONOperation,
} from './operations/exportOperations';
import {
  saveMapOperation,
  loadMapOperation,
  importFromJSONOperation,
} from './operations/persistenceOperations';

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
      nodes: selectNodeOperation(state.nodes, id)
    }));
  },

  updateNodeText: (id, text) => {
    set((state) => ({
      nodes: updateNodeOperation(state.nodes, id, { label: text })
    }));
  },

  addNode: (parentNode, label, position, additionalData = {}) => {
    const { nodes, edges } = get();
    const { nodes: newNodes, edges: newEdges, newNode } = addNodeOperation(
      nodes,
      edges,
      parentNode,
      label,
      position,
      additionalData
    );
    set({ nodes: newNodes, edges: newEdges });
    return newNode;
  },

  updateNode: (id, updates) => {
    set((state) => ({
      nodes: updateNodeOperation(state.nodes, id, updates)
    }));
  },

  removeChildNodes: (nodeId) => {
    set((state) => {
      const nodeIdsToRemove = collectNodesToRemove(state.nodes, state.edges, nodeId);
      const { nodes: updatedNodes, edges: updatedEdges } = removeNodesAndEdges(
        state.nodes,
        state.edges,
        nodeIdsToRemove
      );
      return { nodes: updatedNodes, edges: updatedEdges };
    });
  },

  exportAsImage: exportAsImageOperation,
  exportAsPDF: exportAsPDFOperation,
  exportAsJSON: () => {
    const { nodes, edges } = get();
    exportAsJSONOperation(nodes, edges);
  },

  importFromJSON: (jsonString) => {
    const result = importFromJSONOperation(jsonString);
    if (result) {
      set(result);
    }
  },

  saveMap: () => {
    const { nodes, edges } = get();
    saveMapOperation(nodes, edges);
  },

  loadMap: () => {
    const result = loadMapOperation();
    if (result) {
      set(result);
    }
  },

  setModelConfig: (config) => set({ modelConfig: config }),
}));