import { Node as ReactFlowNode } from 'reactflow';
import { HORIZONTAL_SPACING, VERTICAL_SPACING } from '../constants/layoutConstants';
import { MindMapState } from '../types/mindMapTypes';

export const createNodeSlice = (set: any, get: any) => ({
  addNode: (parentNode: ReactFlowNode | null, label: string, index = 0, totalSiblings = 1) => {
    const { layout } = get();
    const spacing = HORIZONTAL_SPACING[layout];
    const verticalSpacing = VERTICAL_SPACING[layout];
    
    // 子ノードの位置を計算
    const calculatePosition = () => {
      if (!parentNode) {
        return { x: window.innerWidth / 2, y: window.innerHeight / 3 };
      }

      const verticalOffset = ((index - (totalSiblings - 1) / 2) * verticalSpacing.sub);
      
      switch (layout) {
        case 'vertical':
          return {
            x: parentNode.position.x + ((index - (totalSiblings - 1) / 2) * spacing.sub),
            y: parentNode.position.y + spacing.main,
          };
        case 'radial':
          const angleStep = (Math.PI * 0.8) / Math.max(totalSiblings - 1, 1);
          const startAngle = -Math.PI * 0.4;
          const angle = startAngle + (index * angleStep);
          const radius = spacing.main;
          return {
            x: parentNode.position.x + Math.cos(angle) * radius,
            y: parentNode.position.y + Math.sin(angle) * radius,
          };
        default: // horizontal
          return {
            x: parentNode.position.x + spacing.main,
            y: parentNode.position.y + verticalOffset,
          };
      }
    };

    const position = calculatePosition();
    
    const newNode = {
      id: `${Date.now()}-${index}`,
      type: 'mindNode',
      data: { label, isNew: true },
      position,
    };

    set({ nodes: [...get().nodes, newNode] });

    if (parentNode) {
      const newEdge = {
        id: `e${parentNode.id}-${newNode.id}`,
        source: parentNode.id,
        target: newNode.id,
      };
      set({ edges: [...get().edges, newEdge] });
    }

    return newNode;
  },

  updateNodeText: (id: string, text: string, withAnimation = false) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { 
              ...node.data, 
              label: text,
              isGenerating: withAnimation 
            }
          };
        }
        return node;
      });

      // アニメーション付きの場合、タイピングエフェクトを開始
      if (withAnimation) {
        setTimeout(() => {
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === id
                ? { ...node, data: { ...node.data, isGenerating: false } }
                : node
            ),
          }));
        }, text.length * 50 + 500); // テキストの長さに応じて遅延を調整
      }

      return {
        nodes: updatedNodes,
        history: {
          past: [...state.history.past, state.nodes],
          present: updatedNodes,
          future: [],
        }
      };
    });
  },

  updateNodePosition: (id: string, position: { x: number; y: number }) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, position } : node
      ),
    });
  },

  updateNodeColor: (nodeId: string, color: string) => {
    set((state) => ({
      nodes: state.nodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, color } }
          : node
      )
    }));
  },

  deleteNode: (nodeId: string) => {
    set((state) => {
      // 削除するノードとその子ノードのIDを収集
      const nodesToDelete = new Set<string>();
      const collectNodes = (id: string) => {
        nodesToDelete.add(id);
        state.edges
          .filter(edge => edge.source === id)
          .forEach(edge => collectNodes(edge.target));
      };
      collectNodes(nodeId);

      return {
        nodes: state.nodes.filter(node => !nodesToDelete.has(node.id)),
        edges: state.edges.filter(edge => 
          !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)
        ),
      };
    });
  },

  toggleCollapse: (nodeId: string) => {
    set((state) => {
      const updatedNodes = state.nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, isCollapsed: !node.data.isCollapsed }
          };
        }
        return node;
      });

      // 子ノードの表示/非表示を切り替え
      const childNodes = new Set<string>();
      const collectChildNodes = (id: string) => {
        state.edges
          .filter(edge => edge.source === id)
          .forEach(edge => {
            childNodes.add(edge.target);
            collectChildNodes(edge.target);
          });
      };
      collectChildNodes(nodeId);

      const isCollapsed = !state.nodes.find(n => n.id === nodeId)?.data.isCollapsed;
      const finalNodes = updatedNodes.map(node => {
        if (childNodes.has(node.id)) {
          return {
            ...node,
            hidden: isCollapsed
          };
        }
        return node;
      });

      return { nodes: finalNodes };
    });
  },
});
