import { create } from 'zustand';
import { Node, Edge, Connection, addEdge } from 'reactflow';
import { NodeData } from '../types/node';
import { calculateNodePosition } from '../utils/nodeUtils';
import { removeNodeAndDescendants } from '../utils/nodeOperations';

interface MindMapStore {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
}

export const useMindMapStore = create<MindMapStore>((set) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
  onEdgesChange: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  onConnect: (connection) => set((state) => ({ edges: addEdge(connection, state.edges) })),
  updateNodes: (nodes) => set({ nodes }),
  updateEdges: (edges) => set({ edges }),
}));
