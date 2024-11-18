import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';
import { removeNodeAndDescendants } from './nodeOperations';

export interface NodeState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
  removeChildNodes: (nodeId: string) => void;
  updateNode: (id: string, updates: Partial<NodeData>) => void;
}

export const createNodeSlice = (set: any, get: any): NodeState => ({
  nodes: [],
  edges: [],
  
  onNodesChange: (changes) => {
    set((state: any) => ({
      nodes: changes.reduce((acc: Node<NodeData>[], change: any) => {
        if (change.type === 'remove') {
          return acc.filter(node => node.id !== change.id);
        }
        return acc;
      }, [...state.nodes])
    }));
  },

  onEdgesChange: (changes) => {
    set((state: any) => ({
      edges: changes.reduce((acc: Edge[], change: any) => {
        if (change.type === 'remove') {
          return acc.filter(edge => edge.id !== change.id);
        }
        return acc;
      }, [...state.edges])
    }));
  },

  onConnect: (connection) => {
    set((state: any) => ({
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

  removeChildNodes: (nodeId) => {
    set((state: any) => {
      const { nodes: updatedNodes, edges: updatedEdges } = removeNodeAndDescendants(
        state.nodes,
        state.edges,
        nodeId
      );
      return {
        nodes: updatedNodes,
        edges: updatedEdges
      };
    });
  },

  updateNode: (id, updates) => {
    set((state: any) => ({
      nodes: state.nodes.map((node: Node<NodeData>) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...updates
              }
            }
          : node
      )
    }));
  },
});