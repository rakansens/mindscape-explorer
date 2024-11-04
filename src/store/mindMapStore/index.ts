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
  ...createActions(set, get),
}));