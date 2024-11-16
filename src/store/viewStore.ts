import { create } from 'zustand';
import { ReactFlowInstance } from 'reactflow';

type Theme = 'light' | 'dark' | 'blue' | 'purple' | 'sepia';

interface ViewStore {
  theme: Theme;
  showMinimap: boolean;
  animatingNodes: Set<string>;
  loadingNodes: Set<string>;
  instance: ReactFlowInstance | null;
  setTheme: (theme: Theme) => void;
  toggleMinimap: () => void;
  setNodeAnimating: (nodeId: string, isAnimating: boolean) => void;
  setNodeLoading: (nodeId: string, isLoading: boolean) => void;
  setInstance: (instance: ReactFlowInstance | null) => void;
  fitView: () => void;
}

export const useViewStore = create<ViewStore>((set, get) => ({
  theme: 'light',
  showMinimap: false,
  animatingNodes: new Set<string>(),
  loadingNodes: new Set<string>(),
  instance: null,
  
  setTheme: (theme) => {
    document.documentElement.classList.remove('light', 'dark', 'blue', 'purple', 'sepia');
    document.documentElement.classList.add(theme);
    set({ theme });
  },
  
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

  setInstance: (instance) => set({ instance }),
  
  fitView: () => {
    const { instance } = get();
    if (instance) {
      instance.fitView({ padding: 0.2 });
    }
}));
