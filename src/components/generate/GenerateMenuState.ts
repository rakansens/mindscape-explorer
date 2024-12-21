import { create } from 'zustand';

interface GenerateMenuState {
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
}

export const useGenerateMenuState = create<GenerateMenuState>((set) => ({
  isVisible: false,
  setVisible: (visible) => set({ isVisible: visible }),
}));