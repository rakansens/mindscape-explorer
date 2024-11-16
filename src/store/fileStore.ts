import { create } from 'zustand';
import { FileSystemItem, MindMapFile, Folder } from '../types/file';
import { generateId } from '../utils/idUtils';

interface FileStore {
  items: FileSystemItem[];
  activeFileId: string | null;
  editingId: string | null;
  editingTitle: string;
  expandedFolders: Set<string>;
  
  addFile: (file: MindMapFile) => void;
  createFile: (title: string) => void;
  createFolder: (title: string) => void;
  removeItem: (id: string) => void;
  deleteItem: (id: string, e: React.MouseEvent) => void;
  updateItem: (id: string, updates: Partial<FileSystemItem>) => void;
  
  setActiveFile: (id: string) => void;
  startEditing: (id: string, title: string, e: React.MouseEvent) => void;
  saveTitle: (id: string, e: React.MouseEvent) => void;
  cancelEditing: (e: React.MouseEvent) => void;
  setEditingTitle: (value: string) => void;
  
  toggleFolder: (id: string) => void;
  getChildren: (parentId: string | null) => FileSystemItem[];
  
  autoSave: () => void;
}

export const useFileStore = create<FileStore>((set, get) => ({
  items: [],
  activeFileId: null,
  editingId: null,
  editingTitle: '',
  expandedFolders: new Set(),

  addFile: (file) => set((state) => ({
    items: [...state.items, file]
  })),

  createFile: (title) => {
    const newFile: MindMapFile = {
      id: generateId(),
      title,
      type: 'file',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        nodes: [],
        edges: []
      }
    };
    get().addFile(newFile);
  },

  createFolder: (title) => {
    const newFolder: Folder = {
      id: generateId(),
      title,
      type: 'folder',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    set((state) => ({
      items: [...state.items, newFolder] as FileSystemItem[]
    }));
  },

  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
    activeFileId: state.activeFileId === id ? null : state.activeFileId
  })),

  deleteItem: (id, e) => {
    e.stopPropagation();
    get().removeItem(id);
  },

  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, ...updates } as FileSystemItem : item
    )
  })),

  setActiveFile: (id) => set({ activeFileId: id }),

  startEditing: (id, title, e) => {
    e.stopPropagation();
    set({
      editingId: id,
      editingTitle: title
    });
  },

  saveTitle: (id, e) => {
    e.stopPropagation();
    const store = get();
    store.updateItem(id, { title: store.editingTitle });
    set({
      editingId: null,
      editingTitle: ''
    });
  },

  cancelEditing: (e) => {
    e.stopPropagation();
    set({
      editingId: null,
      editingTitle: ''
    });
  },

  setEditingTitle: (value) => set({ editingTitle: value }),

  toggleFolder: (id) => set((state) => {
    const newExpandedFolders = new Set(state.expandedFolders);
    if (newExpandedFolders.has(id)) {
      newExpandedFolders.delete(id);
    } else {
      newExpandedFolders.add(id);
    }
    return { expandedFolders: newExpandedFolders };
  }),

  getChildren: (parentId) => {
    return get().items.filter(item => item.parentId === parentId);
  },

  autoSave: () => {
    const { items, activeFileId } = get();
    localStorage.setItem('mindmap-files', JSON.stringify({ items, activeFileId }));
  }
}));