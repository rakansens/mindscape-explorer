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

// ブラウザの設定に基づいて初期テーマを決定
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
      return savedTheme;
    }
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      return 'dark';
    }
  }
  document.documentElement.classList.add('light');
  return 'light';
};

export const useViewStore = create<ViewStore>((set, get) => ({
  theme: getInitialTheme(),
  showMinimap: false,
  animatingNodes: new Set<string>(),
  loadingNodes: new Set<string>(),
  instance: null,
  
  setTheme: (theme) => {
    document.documentElement.classList.remove('light', 'dark', 'blue', 'purple', 'sepia');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
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
  }
}));