import { create } from 'zustand';
import { FileSystemItem, MindMapFile, Folder } from '../types/file';
import { generateId } from '../utils/idUtils';

interface FileStore {
  items: FileSystemItem[];
  activeFileId: string | null;
  editingId: string | null;
  editingTitle: string;
  expandedFolders: Set<string>;
  setActiveFile: (id: string) => void;
  createFolder: (title: string) => void;
  createFile: (title: string) => void;
  addFile: (file: MindMapFile) => void;
  deleteItem: (id: string) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<MindMapFile | Folder>) => void;
  startEditing: (id: string) => void;
  saveTitle: () => void;
  cancelEditing: () => void;
  setEditingTitle: (title: string) => void;
  toggleFolder: (id: string) => void;
  getChildren: (parentId: string | null) => FileSystemItem[];
}

export const useFileStore = create<FileStore>((set, get) => ({
  items: [],
  activeFileId: null,
  editingId: null,
  editingTitle: '',
  expandedFolders: new Set(),

  setActiveFile: (id) => set({ activeFileId: id }),
  
  createFolder: (title) => {
    const newFolder: Folder = {
      id: generateId(),
      title,
      type: 'folder',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set(state => ({ items: [...state.items, newFolder] }));
  },

  createFile: (title) => {
    const newFile: MindMapFile = {
      id: generateId(),
      title,
      type: 'file',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: { nodes: [], edges: [] }
    };
    set(state => ({ items: [...state.items, newFile] }));
  },

  addFile: (file) => {
    set(state => ({ items: [...state.items, file] }));
  },

  deleteItem: (id) => {
    set(state => ({ items: state.items.filter(item => item.id !== id) }));
  },

  removeItem: (id) => {
    set(state => ({ items: state.items.filter(item => item.id !== id) }));
  },

  updateItem: (id, updates) => {
    set(state => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
      )
    }));
  },

  startEditing: (id) => set({ editingId: id }),
  
  saveTitle: () => {
    const { editingId, editingTitle, items } = get();
    if (editingId && editingTitle.trim()) {
      set(state => ({
        items: state.items.map(item =>
          item.id === editingId ? { ...item, title: editingTitle.trim() } : item
        ),
        editingId: null,
        editingTitle: ''
      }));
    }
  },

  cancelEditing: () => set({ editingId: null, editingTitle: '' }),
  
  setEditingTitle: (title) => set({ editingTitle: title }),
  
  toggleFolder: (id) => {
    set(state => {
      const expandedFolders = new Set(state.expandedFolders);
      if (expandedFolders.has(id)) {
        expandedFolders.delete(id);
      } else {
        expandedFolders.add(id);
      }
      return { expandedFolders };
    });
  },

  getChildren: (parentId) => {
    return get().items.filter(item => item.parentId === parentId);
  },
}));