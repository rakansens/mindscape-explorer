import { create } from 'zustand';
import { Node, Edge, Connection } from 'reactflow';
import { NodeData } from '../types/node';
import { useHistoryStore } from './historyStore';
import {
  addNodeOperation,
  removeNodesOperation,
  updateNodeOperation,
} from './mindMapOperations';

interface MindMapState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
  selectNode: (id: string | null) => void;
  updateNodeText: (id: string, text: string) => void;
  addNode: (parentNode: Node<NodeData>, label: string, position: { x: number; y: number }) => void;
  updateNode: (id: string, updates: Partial<NodeData>) => void;
  removeChildNodes: (nodeId: string) => void;
  undo: () => void;
  redo: () => void;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  nodes: [{
    id: '1',
    type: 'custom',
    position: { x: window.innerWidth / 2 - 75, y: window.innerHeight / 3 },
    data: { 
      label: 'メインテーマ',
      selected: false,
      isGenerating: false,
      isAppearing: false
    }
  }],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set((state) => {
      const newState = {
        nodes: applyNodeChanges(changes, state.nodes),
      };
      useHistoryStore.getState().addToHistory(newState.nodes, state.edges);
      return newState;
    });
  },

  onEdgesChange: (changes) => {
    set((state) => {
      const newState = {
        edges: applyEdgeChanges(changes, state.edges),
      };
      useHistoryStore.getState().addToHistory(state.nodes, newState.edges);
      return newState;
    });
  },

  onConnect: (connection) => {
    set((state) => {
      const newState = {
        edges: addEdge(connection, state.edges),
      };
      useHistoryStore.getState().addToHistory(state.nodes, newState.edges);
      return newState;
    });
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
      })),
      selectedNodeId: id
    }));
  },

  updateNodeText: (id, text) => {
    set((state) => {
      const newNodes = updateNodeOperation(state.nodes, id, { label: text });
      useHistoryStore.getState().addToHistory(newNodes, state.edges);
      return { nodes: newNodes };
    });
  },

  addNode: (parentNode, label, position) => {
    set((state) => {
      const { nodes, edges, newNodeId } = addNodeOperation(
        state.nodes,
        state.edges,
        parentNode,
        label,
        position
      );
      useHistoryStore.getState().addToHistory(nodes, edges);
      return { nodes, edges, selectedNodeId: newNodeId };
    });
  },

  updateNode: (id, updates) => {
    set((state) => {
      const newNodes = updateNodeOperation(state.nodes, id, updates);
      useHistoryStore.getState().addToHistory(newNodes, state.edges);
      return { nodes: newNodes };
    });
  },

  removeChildNodes: (nodeId) => {
    set((state) => {
      const nodeIdsToRemove = [nodeId];
      const edgesToCheck = [...state.edges];
      
      while (edgesToCheck.length > 0) {
        const edge = edgesToCheck.pop();
        if (edge && nodeIdsToRemove.includes(edge.source)) {
          const targetId = edge.target;
          if (!nodeIdsToRemove.includes(targetId)) {
            nodeIdsToRemove.push(targetId);
          }
        }
      }

      const { nodes, edges } = removeNodesOperation(state.nodes, state.edges, nodeIdsToRemove);
      useHistoryStore.getState().addToHistory(nodes, edges);
      return { nodes, edges, selectedNodeId: null };
    });
  },

  undo: () => {
    const previous = useHistoryStore.getState().undo();
    if (previous) {
      set({ nodes: previous.nodes, edges: previous.edges });
    }
  },

  redo: () => {
    const next = useHistoryStore.getState().redo();
    if (next) {
      set({ nodes: next.nodes, edges: next.edges });
    }
  },
}));