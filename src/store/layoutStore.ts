import { create } from 'zustand';
import { LayoutType } from '../types/layout';

interface LayoutState {
  layout: {
    type: LayoutType;
    isCompact: boolean;
  };
  setLayout: (layout: { type: LayoutType }) => void;
  toggleCompactMode: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  layout: {
    type: 'horizontal',
    isCompact: false,
  },
  setLayout: (newLayout) =>
    set((state) => ({
      layout: { ...state.layout, ...newLayout },
    })),
  toggleCompactMode: () =>
    set((state) => ({
      layout: { ...state.layout, isCompact: !state.layout.isCompact },
    })),
}));