import { create } from 'zustand';
import { LayoutType, LayoutConfig } from '../types/layout';
import { getLayoutedElements } from '../utils/layoutUtils';
import { applyForceLayout } from '../utils/forceLayout';
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

interface LayoutStore {
  layout: LayoutConfig;
  setLayout: (layout: LayoutConfig) => void;
  applyLayout: (nodes: Node<NodeData>[], edges: Edge[], width: number, height: number) => { nodes: Node<NodeData>[]; edges: Edge[] };
}

export const useLayoutStore = create<LayoutStore>((set, get) => ({
  layout: {
    type: 'layered',
    direction: 'TB',
    nodeSpacing: 100,
    rankSpacing: 200,
  },

  setLayout: (layout) => set({ layout }),

  applyLayout: (nodes, edges, width, height) => {
    const { layout } = get();
    
    switch (layout.type) {
      case 'force':
        // フォースレイアウトの場合は既存の実装を使用
        return { nodes, edges };
      case 'layered':
      default:
        // 階層レイアウトの場合は既存の実装を使用
        return getLayoutedElements(nodes, edges, {
          direction: layout.direction,
          nodeSpacing: layout.nodeSpacing,
          rankSpacing: layout.rankSpacing,
        });
    }
  },
}));