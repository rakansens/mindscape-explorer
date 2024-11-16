import create from 'zustand';
import { LineStyle } from '../types/reactflow';

interface ViewState {
  theme: string;
  setTheme: (theme: string) => void;
  showMinimap: boolean;
  toggleMinimap: () => void;
  edgeStyle: string;
  setEdgeStyle: (style: string) => void;
  lineStyle: LineStyle;
  setLineStyle: (style: LineStyle) => void;
  instance: any; // ReactFlow instance type can be refined
  setInstance: (instance: any) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  showMinimap: true,
  toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),
  edgeStyle: 'custom',
  setEdgeStyle: (style) => set({ edgeStyle: style }),
  lineStyle: 'solid', // Default line style
  setLineStyle: (style) => set({ lineStyle: style }),
  instance: null,
  setInstance: (instance) => set({ instance }),
}));
