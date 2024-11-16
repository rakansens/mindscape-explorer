import { create } from 'zustand';

type LineStyle = 'solid' | 'dashed' | 'double' | 'wavy' | 'gradient' | 'varying';

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
  fitView: () => void;
  setNodeAnimating: (nodeId: string, isAnimating: boolean) => void;
}

export const useViewStore = create<ViewState>((set, get) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  showMinimap: true,
  toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),
  edgeStyle: 'custom',
  setEdgeStyle: (style) => set({ edgeStyle: style }),
  lineStyle: 'solid',
  setLineStyle: (style) => set({ lineStyle: style }),
  instance: null,
  setInstance: (instance) => set({ instance }),
  fitView: () => {
    const { instance } = get();
    if (instance) {
      instance.fitView({ duration: 500, padding: 0.1 });
    }
  },
  setNodeAnimating: (nodeId, isAnimating) => {
    // This function is used to track node animation states
    // Implementation can be expanded based on needs
  }
}));