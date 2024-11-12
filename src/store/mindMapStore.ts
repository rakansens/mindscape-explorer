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

// ノードの配置に関する定数
const NODE_SPACING = {
  HORIZONTAL: 250, // ノード間の水平方向の間隔
  VERTICAL: 100,   // ノード間の垂直方向の間隔
};

export const useMindMapStore = create<MindMapStore>((set, get) => ({
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
    const state = get();
    
    // 親ノードの子ノードの数を取得
    const childCount = state.edges.filter(edge => edge.source === parentNode.id).length;
    
    // 新しいノードの位置を計算
    const newPosition = position || calculateNewNodePosition(parentNode, childCount, state.nodes);
    
    const newNode: Node<NodeData> = {
      id: nanoid(),
      type: 'custom',
      position: newPosition,
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

  setModelConfig: (config) => {
    if (config === null) {
      set({ modelConfig: getDefaultModelConfig() });
    } else {
      set((state) => ({
        modelConfig: {
          ...state.modelConfig,
          ...config,
          apiKey: config.type.includes('GEMINI') 
            ? state.modelConfig?.geminiKey || ''
            : state.modelConfig?.apiKey || ''
        }
      }));
    }
  },
}));

// 新しいノードの位置を計算する関数
function calculateNewNodePosition(
  parentNode: Node<NodeData>,
  childCount: number,
  allNodes: Node[]
): { x: number; y: number } {
  const angle = (childCount * (2 * Math.PI / 8)) - Math.PI / 2; // 8分割で配置
  const radius = NODE_SPACING.HORIZONTAL;

  const baseX = parentNode.position.x + Math.cos(angle) * radius;
  const baseY = parentNode.position.y + Math.sin(angle) * radius;

  // 他のノードとの衝突を避けるための調整
  let adjustedPosition = { x: baseX, y: baseY };
  let attempts = 0;
  const maxAttempts = 8;

  while (isPositionOccupied(adjustedPosition, allNodes) && attempts < maxAttempts) {
    const adjustmentAngle = angle + (attempts * Math.PI / 4);
    adjustedPosition = {
      x: parentNode.position.x + Math.cos(adjustmentAngle) * (radius + attempts * 50),
      y: parentNode.position.y + Math.sin(adjustmentAngle) * (radius + attempts * 50)
    };
    attempts++;
  }

  return adjustedPosition;
}

// 指定された位置が他のノードと重なっているかチェックする関数
function isPositionOccupied(position: { x: number; y: number }, nodes: Node[]): boolean {
  const minDistance = 150; // ノード間の最小距離
  return nodes.some(node => {
    const dx = node.position.x - position.x;
    const dy = node.position.y - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < minDistance;
  });
}
