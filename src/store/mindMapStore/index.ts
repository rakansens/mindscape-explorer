import { create } from 'zustand';
import { RFState } from './types';
import { createActions } from './actions';

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Main Topic' },
    position: { x: 0, y: 0 },
  },
];

export const useMindMapStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  theme: 'light',
  showMinimap: false,
  setTheme: (theme) => {
    set({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },
  toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),
  zoomIn: () => console.log('Zoom in triggered'),
  zoomOut: () => console.log('Zoom out triggered'),
  fitView: () => console.log('Fit view triggered'),
  ...createActions(set, get),
}));