import { create } from 'zustand';
import { Node, Edge } from '../types/reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';

interface MindMapStore {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  updateNodes: (nodes: Node[]) => void;
  updateEdges: (edges: Edge[]) => void;
  selectNode: (id: string) => void;
  updateNodeText: (id: string, text: string) => void;
  addNode: (parentNode: Node, label: string, position?: { x: number; y: number }) => Node;
  updateNode: (id: string, updates: Partial<Node>) => void;
  removeChildNodes: (nodeId: string) => void;
}

// 初期ノードの設定
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: window.innerWidth / 2 - 75, y: window.innerHeight / 3 },
    data: { label: 'メインテーマ' }
  }
];

export const useMindMapStore = create<MindMapStore>((set) => ({
  nodes: initialNodes,
  edges: [],

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
      nodes: state.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          selected: node.id === id
        }
      }))
    }));
  },

  updateNodeText: (id, text) => {
    set((state) => ({
      nodes: state.nodes.map(node =>
        node.id === id ? { ...node, data: { ...node.data, label: text } } : node
      )
    }));
  },

  addNode: (parentNode, label, position) => {
    const newNode: Node = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'custom',
      position: position || {
        x: parentNode.position.x + 250,
        y: parentNode.position.y
      },
      data: { label }
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      edges: [
        ...state.edges,
        {
          id: `e${parentNode.id}-${newNode.id}`,
          source: parentNode.id,
          target: newNode.id,
          type: 'custom'
        }
      ]
    }));

    return newNode;
  },

  updateNode: (id, updates) => {
    set((state) => ({
      nodes: state.nodes.map(node =>
        node.id === id ? { ...node, ...updates } : node
      )
    }));
  },

  removeChildNodes: (nodeId) => {
    set((state) => {
      const childIds = new Set<string>();
      const getChildIds = (parentId: string) => {
        state.edges.forEach(edge => {
          if (edge.source === parentId) {
            childIds.add(edge.target);
            getChildIds(edge.target);
          }
        });
      };
      getChildIds(nodeId);

      return {
        nodes: state.nodes.filter(node => !childIds.has(node.id)),
        edges: state.edges.filter(edge => !childIds.has(edge.target))
      };
    });
  },
}));
