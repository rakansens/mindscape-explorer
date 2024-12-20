import { create } from 'zustand';

type LineStyle = 'solid' | 'dashed' | 'double' | 'wavy' | 'gradient' | 'varying';

interface FitViewOptions {
  duration?: number;
  padding?: number;
  minZoom?: number;
  maxZoom?: number;
  includeHiddenNodes?: boolean; // ここにプロパティを追加
}

interface ViewState {
  theme: string;
  setTheme: (theme: string) => void;
  showMinimap: boolean;
  toggleMinimap: () => void;
  edgeStyle: string;
  setEdgeStyle: (style: string) => void;
  lineStyle: LineStyle;
  setLineStyle: (style: LineStyle) => void;
  instance: any;
  setInstance: (instance: any) => void;
  fitView: (options?: FitViewOptions) => void;
  setNodeAnimating: (nodeId: string, isAnimating: boolean) => void;
}

export const useViewStore = create<ViewState>((set, get) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  showMinimap: false,
  toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),
  edgeStyle: 'custom',
  setEdgeStyle: (style) => set({ edgeStyle: style }),
  lineStyle: 'solid',
  setLineStyle: (style) => set({ lineStyle: style }),
  instance: null,
  setInstance: (instance) => set({ instance }),
  fitView: (options) => {
    const { instance } = get();
    if (instance) {
      instance.fitView(options);
    }
  },
  setNodeAnimating: (nodeId, isAnimating) => {
    // この関数はノードのアニメーション状態を追跡するために使用されます
    // 必要に応じて実装を拡張できます
  }
}));