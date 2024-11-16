import { create } from 'zustand';
import { FileSystemItem, MindMapFile, Folder } from '../types/file';

interface FileStore {
  items: FileSystemItem[];
  activeFileId: string | null;
  addFile: (file: MindMapFile) => void;
  addFolder: (folder: Folder) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<FileSystemItem>) => void;
  setActiveFile: (id: string | null) => void;
  getChildren: (parentId: string | null) => FileSystemItem[];
  autoSave: () => void;
}

export const useFileStore = create<FileStore>((set, get) => ({
  items: [],
  activeFileId: null,

  addFile: (file) => set((state) => ({
    items: [...state.items, file]
  })),

  addFolder: (folder) => set((state) => ({
    items: [...state.items, folder]
  })),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
    activeFileId: state.activeFileId === id ? null : state.activeFileId
  })),

  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    )
  })),

  setActiveFile: (id) => set({ activeFileId: id }),

  getChildren: (parentId) => {
    const { items } = get();
    return items.filter(item => item.parentId === parentId);
  },

  autoSave: () => {
    const { items, activeFileId } = get();
    localStorage.setItem('mindmap-files', JSON.stringify({ items, activeFileId }));
  }
}));