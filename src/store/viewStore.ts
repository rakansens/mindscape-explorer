import { create } from 'zustand';
import { ReactFlowInstance } from 'reactflow';

type ViewState = {
  instance: ReactFlowInstance | null;
  setInstance: (instance: ReactFlowInstance) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
};

export const useViewStore = create<ViewState>((set, get) => ({
  instance: null,
  setInstance: (instance: ReactFlowInstance) => set({ instance }),
  zoomIn: () => {
    const { instance } = get();
    if (instance) {
      instance.zoomIn();
    }
  },
  zoomOut: () => {
    const { instance } = get();
    if (instance) {
      instance.zoomOut();
    }
  },
  fitView: () => {
    const { instance } = get();
    if (instance) {
      instance.fitView({
        duration: 500,
        padding: 0.5,
        minZoom: 0.5,
        maxZoom: 1.5
      });
    }
  },
}));