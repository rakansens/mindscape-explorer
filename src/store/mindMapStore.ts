import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { ModelConfig } from '../types/models';
import { NodeData } from '../types/node';

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
}

export const useMindMapStore = create<MindMapStore>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  modelConfig: null,

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

  addNode: (parentNode, label, position, additionalData = {}) => {
    const newNode: Node<NodeData> = {
      id: nanoid(),
      type: 'custom',
      position: position || { x: 0, y: 0 },
      data: {
        label,
        isGenerating: false,
        isAppearing: false,
        selected: false,
        ...additionalData
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      edges: parentNode
        ? [...state.edges, {
            id: `${parentNode.id}-${newNode.id}`,
            source: parentNode.id,
            target: newNode.id,
            type: 'custom'
          }]
        : state.edges,
    }));

    return newNode;
  },

  updateNode: (id, updates) => {
    set((state) => ({
      nodes: state.nodes.map(node =>
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

  setModelConfig: (config) => set({ modelConfig: config }),
}));