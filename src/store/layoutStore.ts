import { create } from 'zustand';
import { LayoutType, LayoutConfig } from '../types/layout';
import { Node, Edge } from 'reactflow';
import { getLayoutedElements, getCircleLayout, getRadialLayout, applyForceLayout } from '../utils/layoutUtils';

interface LayoutState {
  layout: LayoutConfig;
  setLayout: (layout: Partial<LayoutConfig>) => void;
  toggleCompactMode: () => void;
  applyLayout: (nodes: Node[], edges: Edge[], width: number, height: number) => { nodes: Node[]; edges: Edge[] };
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  layout: {
    type: 'horizontal',
    direction: 'LR',
    nodeSpacing: 100,
    rankSpacing: 200,
    isCompact: false,
  },
  setLayout: (newLayout) =>
    set((state) => ({
      layout: { ...state.layout, ...newLayout },
    })),
  toggleCompactMode: () =>
    set((state) => ({
      layout: {
        ...state.layout,
        isCompact: !state.layout.isCompact,
        // コンパクトモード時の間隔をより狭く設定
        nodeSpacing: !state.layout.isCompact ? 30 : 100,  // 60 -> 30
        rankSpacing: !state.layout.isCompact ? 80 : 200,  // 120 -> 80
      },
    })),
  applyLayout: (nodes, edges, width, height) => {
    const { layout } = get();
    
    switch (layout.type) {
      case 'circle':
        return getCircleLayout(nodes, edges, width, height);
      case 'radial':
        return getRadialLayout(nodes, edges, width, height);
      case 'force':
        return applyForceLayout(nodes, edges, width, height);
      default:
        return getLayoutedElements(nodes, edges, {
          direction: layout.direction || 'LR',
          nodeSpacing: layout.nodeSpacing,
          rankSpacing: layout.rankSpacing,
        });
    }
  },
}));