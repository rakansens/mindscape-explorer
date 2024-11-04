import { SetStateAction } from 'zustand';
import { MindMapStore } from '../types/mindMapTypes';

export const handleHistory = {
  undo: (set: SetStateAction<any>, get: () => MindMapStore) => {
    const { history, currentHistoryIndex } = get();
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const previousState = history[newIndex];
      set({
        nodes: previousState.nodes,
        edges: previousState.edges,
        currentHistoryIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
      });
    }
  },

  redo: (set: SetStateAction<any>, get: () => MindMapStore) => {
    const { history, currentHistoryIndex } = get();
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const nextState = history[newIndex];
      set({
        nodes: nextState.nodes,
        edges: nextState.edges,
        currentHistoryIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < history.length - 1,
      });
    }
  },
};