import { StateCreator } from 'zustand';
import { MindMapStore } from '../types/mindMapTypes';

type SetFunction = StateCreator<MindMapStore, [], [], MindMapStore>;

export const handleHistory = {
  undo: (set: SetFunction, get: () => MindMapStore) => {
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

  redo: (set: SetFunction, get: () => MindMapStore) => {
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