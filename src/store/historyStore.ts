import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

interface HistoryState {
  past: { nodes: Node<NodeData>[]; edges: Edge[] }[];
  future: { nodes: Node<NodeData>[]; edges: Edge[] }[];
  addToHistory: (nodes: Node<NodeData>[], edges: Edge[]) => void;
  undo: () => { nodes: Node<NodeData>[]; edges: Edge[] } | null;
  redo: () => { nodes: Node<NodeData>[]; edges: Edge[] } | null;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],

  addToHistory: (nodes, edges) => {
    set(state => ({
      past: [...state.past, { nodes: [...nodes], edges: [...edges] }],
      future: [],
    }));
  },

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return null;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set(state => ({
      past: newPast,
      future: [previous, ...state.future],
    }));

    return previous;
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return null;

    const next = future[0];
    const newFuture = future.slice(1);

    set(state => ({
      past: [...state.past, next],
      future: newFuture,
    }));

    return next;
  },

  clear: () => {
    set({ past: [], future: [] });
  },
}));