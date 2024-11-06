import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ViewStore {
  theme: Theme;
  showMinimap: boolean;
  setTheme: (theme: Theme) => void;
  toggleMinimap: () => void;
  fitView: () => void;
}

export const useViewStore = create<ViewStore>((set) => ({
  theme: 'system',
  showMinimap: false,
  setTheme: (theme) => set({ theme }),
  toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),
  fitView: () => {
    // ReactFlowのfitView関数を呼び出す
    const { fitView } = document.querySelector('.react-flow')?.getBoundingClientRect() || {};
    if (fitView) {
      fitView();
    }
  }
}));