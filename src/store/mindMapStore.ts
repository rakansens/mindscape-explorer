import { create } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange, Connection, applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import { NodeData } from '../types/node';

interface MindMapState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
  createChildNode: (parentNode: Node<NodeData>, label: string, position: { x: number; y: number }) => Node<NodeData>;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  nodes: [],
  edges: [],

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

  createChildNode: (parentNode, label, position) => {
    const newNode: Node<NodeData> = {
      id: crypto.randomUUID(),
      type: 'custom',
      position,
      data: { label }
    };

    set(state => ({
      nodes: [...state.nodes, newNode],
      edges: [
        ...state.edges,
        {
          id: `${parentNode.id}-${newNode.id}`,
          source: parentNode.id,
          target: newNode.id,
          type: 'custom'
        }
      ]
    }));

    return newNode;
  }
}));