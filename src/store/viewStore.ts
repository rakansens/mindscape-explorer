import { create } from 'zustand';
import { ReactFlowInstance } from 'reactflow';

type Theme = 'light' | 'dark' | 'blue' | 'purple' | 'sepia' | 'mint' | 'rose' | 'sunset' | 'ocean';
type EdgeStyle = 'bezier' | 'step' | 'smoothstep' | 'straight';
type LineStyle = 'solid' | 'dashed';

interface ViewStore {
  theme: Theme;
  showMinimap: boolean;
  animatingNodes: Set<string>;
  loadingNodes: Set<string>;
  instance: ReactFlowInstance | null;
  edgeStyle: EdgeStyle;
  lineStyle: LineStyle;
  setTheme: (theme: Theme) => void;
  toggleMinimap: () => void;
  setNodeAnimating: (nodeId: string, isAnimating: boolean) => void;
  setNodeLoading: (nodeId: string, isLoading: boolean) => void;
  setInstance: (instance: ReactFlowInstance | null) => void;
  setEdgeStyle: (style: EdgeStyle) => void;
  setLineStyle: (style: LineStyle) => void;
  fitView: () => void;
}

// ブラウザの設定に基づいて初期テーマを決定
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';

  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme) {
    document.documentElement.className = savedTheme;
    return savedTheme;
  }
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.className = 'dark';
    return 'dark';
  }

  document.documentElement.className = 'light';
  return 'light';
};

export const useViewStore = create<ViewStore>((set, get) => ({
  theme: getInitialTheme(),
  showMinimap: false,
  animatingNodes: new Set<string>(),
  loadingNodes: new Set<string>(),
  instance: null,
  edgeStyle: 'bezier',
  lineStyle: 'solid',
  
  setTheme: (theme) => {
    // 既存のすべてのテーマクラスを削除
    document.documentElement.className = '';
    // 新しいテーマを適用
    document.documentElement.className = theme;
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
  },

  setEdgeStyle: (style) => set({ edgeStyle: style }),
  setLineStyle: (style) => set({ lineStyle: style }),
}));
