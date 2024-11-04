import { StoreApi } from 'zustand';
import { MindMapStore } from '../types/mindMapTypes';

type SetFunction = (
  setState: StoreApi<MindMapStore>['setState'],
  getState: StoreApi<MindMapStore>['getState'],
  store: StoreApi<MindMapStore>
) => void;

export const handleHistory = {
  undo: (
    setState: StoreApi<MindMapStore>['setState'],
    getState: StoreApi<MindMapStore>['getState'],
    store: StoreApi<MindMapStore>
  ) => {
    const { history, currentHistoryIndex } = getState();
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const previousState = history[newIndex];
      setState({
        nodes: previousState.nodes,
        edges: previousState.edges,
        currentHistoryIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
      });
    }
  },

  redo: (
    setState: StoreApi<MindMapStore>['setState'],
    getState: StoreApi<MindMapStore>['getState'],
    store: StoreApi<MindMapStore>
  ) => {
    const { history, currentHistoryIndex } = getState();
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const nextState = history[newIndex];
      setState({
        nodes: nextState.nodes,
        edges: nextState.edges,
        currentHistoryIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < history.length - 1,
      });
    }
  },
};