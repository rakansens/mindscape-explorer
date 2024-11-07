import { create } from 'zustand';

interface AnimationState {
  animatingNodes: Set<string>;
  loadingNodes: Set<string>;
  setNodeAnimating: (nodeId: string, isAnimating: boolean) => void;
  setNodeLoading: (nodeId: string, isLoading: boolean) => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  animatingNodes: new Set(),
  loadingNodes: new Set(),

  setNodeAnimating: (nodeId: string, isAnimating: boolean) => 
    set((state) => {
      const newSet = new Set(state.animatingNodes);
      isAnimating ? newSet.add(nodeId) : newSet.delete(nodeId);
      return { animatingNodes: newSet };
    }),

  setNodeLoading: (nodeId: string, isLoading: boolean) =>
    set((state) => {
      const newSet = new Set(state.loadingNodes);
      isLoading ? newSet.add(nodeId) : newSet.delete(nodeId);
      return { loadingNodes: newSet };
    }),
}));