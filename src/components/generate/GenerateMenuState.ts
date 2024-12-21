import { create } from 'zustand';

interface GenerateMenuState {
  isVisible: boolean;
  hoveredNodeId: string | null;
  setVisible: (visible: boolean, nodeId: string | null) => void;
}

export const useGenerateMenuState = create<GenerateMenuState>((set) => ({
  isVisible: false,
  hoveredNodeId: null,
  setVisible: (visible, nodeId) => set({ isVisible: visible, hoveredNodeId: nodeId }),
}));