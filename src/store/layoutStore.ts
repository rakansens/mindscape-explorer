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
    type: 'horizontal',
    direction: 'LR',
    nodeSpacing: 100,
    rankSpacing: 200,
  },

  setLayout: (layout) => {
    set({ layout });
  },

  applyLayout: (nodes, edges, width, height) => {
    const { layout } = get();
    
    switch (layout.type) {
      case 'force':
        return applyForceLayout(nodes, edges, width, height);
      case 'horizontal':
        return getLayoutedElements(nodes, edges, {
          direction: 'LR',
          nodeSpacing: layout.nodeSpacing,
          rankSpacing: layout.rankSpacing,
        });
      case 'layered':
        return getLayoutedElements(nodes, edges, {
          direction: 'TB',
          nodeSpacing: layout.nodeSpacing,
          rankSpacing: layout.rankSpacing,
        });
      case 'tree':
      case 'circle':
      case 'orthogonal':
      default:
        return getLayoutedElements(nodes, edges, {
          direction: layout.direction,
          nodeSpacing: layout.nodeSpacing,
          rankSpacing: layout.rankSpacing,
        });
    }
  },
}));