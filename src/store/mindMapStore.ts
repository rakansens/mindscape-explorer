import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { ModelConfig, getDefaultModelConfig } from '../types/models';
import { NodeData } from '../types/node';

interface MindMapStore {
  nodes: Node<NodeData>[];
  edges: Edge[];
  modelConfig: ModelConfig | null;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
  selectNode: (id: string) => void;
  updateNodeText: (id: string, text: string) => void;
  addNode: (parentNode: Node<NodeData>, label: string, position?: { x: number; y: number }) => Node<NodeData>;
  updateNode: (id: string, updates: Partial<NodeData>) => void;
  removeChildNodes: (nodeId: string) => void;
  setModelConfig: (config: ModelConfig | null) => void;
}

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

// 初期のモデル設定を環境変数から取得
const initialModelConfig = getDefaultModelConfig();

export const useMindMapStore = create<MindMapStore>((set) => ({
  nodes: initialNodes,
  edges: [],
  // 初期値を明示的に設定
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
    const newNode: Node<NodeData> = {
      id: nanoid(),
      type: 'custom',
      position: position || { x: 0, y: 0 },
      data: {
        label,
        isGenerating: false,
        isAppearing: false,
        selected: false,
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      edges: parentNode
        ? [...state.edges, {
            id: `${parentNode.id}-${newNode.id}`,
            source: parentNode.id,
            target: newNode.id,
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

  // ModelConfigの設定を改善
  setModelConfig: (config) => {
    if (config === null) {
      // nullの場合は環境変数から再度設定を読み込む
      set({ modelConfig: getDefaultModelConfig() });
    } else {
      // configが提供された場合は、既存の設定とマージ
      set((state) => ({
        modelConfig: {
          ...state.modelConfig,
          ...config,
          // モデルタイプに応じて適切なAPIキーを設定
          apiKey: config.type.includes('GEMINI') 
            ? state.modelConfig?.geminiKey || ''
            : state.modelConfig?.apiKey || ''
        }
      }));
    }
  },
}));
