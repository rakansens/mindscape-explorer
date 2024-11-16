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
}

export const useViewStore = create<ViewState>((set) => ({
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
}));