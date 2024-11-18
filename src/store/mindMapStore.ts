import { create } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange, Connection, applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import { NodeData } from '../types/node';
import { ModelConfig } from '../types/models';

interface MindMapState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  modelConfig: ModelConfig | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
  updateNode: (nodeId: string, updates: Partial<NodeData>) => void;
  updateNodeText: (nodeId: string, text: string) => void;
  addNode: (parentNode: Node<NodeData>, label: string, position: { x: number; y: number }) => Node<NodeData>;
  removeChildNodes: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  setModelConfig: (config: ModelConfig) => void;
  saveMap: () => void;
  loadMap: () => void;
  exportAsImage: () => void;
  exportAsPDF: () => void;
  exportAsJSON: () => void;
  importFromJSON: (json: string) => void;
  undo: () => void;
  redo: () => void;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  modelConfig: null,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  updateNodes: (nodes) => set({ nodes }),
  updateEdges: (edges) => set({ edges }),

  updateNode: (nodeId, updates) => {
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...updates } } : node
      ),
    }));
  },

  updateNodeText: (nodeId, text) => {
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === nodeId ? { ...node, data: { ...node.data, label: text } } : node
      ),
    }));
  },

  addNode: (parentNode, label, position) => {
    const newNode: Node<NodeData> = {
      id: crypto.randomUUID(),
      type: 'custom',
      position,
      data: { label, isGenerating: false, isAppearing: false, selected: false }
    };

    const newEdge: Edge = {
      id: `${parentNode.id}-${newNode.id}`,
      source: parentNode.id,
      target: newNode.id,
      type: 'custom'
    };

    set(state => ({
      nodes: [...state.nodes, newNode],
      edges: [...state.edges, newEdge]
    }));

    return newNode;
  },

  removeChildNodes: (nodeId) => {
    set(state => {
      const nodesToRemove = new Set<string>();
      const traverse = (id: string) => {
        nodesToRemove.add(id);
        state.edges
          .filter(edge => edge.source === id)
          .forEach(edge => traverse(edge.target));
      };
      traverse(nodeId);

      return {
        nodes: state.nodes.filter(node => !nodesToRemove.has(node.id)),
        edges: state.edges.filter(edge => 
          !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
        )
      };
    });
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  
  setModelConfig: (config) => set({ modelConfig: config }),

  // Stub implementations for file operations
  saveMap: () => console.log('Save map not implemented'),
  loadMap: () => console.log('Load map not implemented'),
  exportAsImage: () => console.log('Export as image not implemented'),
  exportAsPDF: () => console.log('Export as PDF not implemented'),
  exportAsJSON: () => console.log('Export as JSON not implemented'),
  importFromJSON: () => console.log('Import from JSON not implemented'),
  undo: () => console.log('Undo not implemented'),
  redo: () => console.log('Redo not implemented'),
}));