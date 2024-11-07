import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ViewStore {
  theme: Theme;
  showMinimap: boolean;
  animatingNodes: Set<string>;
  loadingNodes: Set<string>;
  setTheme: (theme: Theme) => void;
  toggleMinimap: () => void;
  setNodeAnimating: (nodeId: string, isAnimating: boolean) => void;
  setNodeLoading: (nodeId: string, isLoading: boolean) => void;
  fitView: () => void;
}

export const useViewStore = create<ViewStore>((set) => ({
  theme: 'system',
  showMinimap: false,
  animatingNodes: new Set<string>(),
  loadingNodes: new Set<string>(),
  
  setTheme: (theme) => set({ theme }),
  
  toggleMinimap: () => set((state) => ({ 
    showMinimap: !state.showMinimap 
  })),
  
  setNodeAnimating: (nodeId: string, isAnimating: boolean) => set((state) => {
    const newAnimatingNodes = new Set(state.animatingNodes);
    if (isAnimating) {
      newAnimatingNodes.add(nodeId);
    } else {
      newAnimatingNodes.delete(nodeId);
    }
    return { animatingNodes: newAnimatingNodes };
  }),
  
  setNodeLoading: (nodeId: string, isLoading: boolean) => set((state) => {
    const newLoadingNodes = new Set(state.loadingNodes);
    if (isLoading) {
      newLoadingNodes.add(nodeId);
    } else {
      newLoadingNodes.delete(nodeId);
    }
    return { loadingNodes: newLoadingNodes };
  }),
  
  fitView: () => {
    const { fitView } = document.querySelector('.react-flow')?.getBoundingClientRect() || {};
    if (fitView) {
      fitView();
    }
  }
}));