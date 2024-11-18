import { create } from 'zustand';
import { FileSystemItem, MindMapFile } from '../types/file';

interface FileStore {
  items: FileSystemItem[];
  activeFileId: string | null;
  editingId: string | null;
  editingTitle: string;
  expandedFolders: Set<string>;
  setActiveFile: (id: string) => void;
  createFolder: (title: string) => void;
  createFile: (title: string) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<MindMapFile>) => void;
  startEditing: (id: string) => void;
  saveTitle: () => void;
  cancelEditing: () => void;
  setEditingTitle: (title: string) => void;
  toggleFolder: (id: string) => void;
  getChildren: (parentId: string | null) => FileSystemItem[];
  saveCurrentFile: () => void;
  openFile: () => void;
}

export const useFileStore = create<FileStore>((set, get) => ({
  items: [],
  activeFileId: null,
  editingId: null,
  editingTitle: '',
  expandedFolders: new Set(),

  setActiveFile: (id) => set({ activeFileId: id }),
  
  createFolder: (title) => {
    // Implementation for creating a folder
    const newFolder = {
      id: crypto.randomUUID(),
      title,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: 'folder'
    };
    set(state => ({ items: [...state.items, newFolder] }));
  },

  createFile: (title) => {
    const newFile: MindMapFile = {
      id: crypto.randomUUID(),
      title,
      type: 'file',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: { nodes: [], edges: [] } // initialize with empty data
    };
    set(state => ({ items: [...state.items, newFile] }));
  },

  deleteItem: (id) => {
    set(state => ({ items: state.items.filter(item => item.id !== id) }));
  },

  updateItem: (id, updates) => {
    set(state => ({
      items: state.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  },

  startEditing: (id) => set({ editingId: id }),
  
  saveTitle: () => {
    // Implementation for saving the editing title
    set(state => ({
      items: state.items.map(item => 
        item.id === state.editingId ? { ...item, title: state.editingTitle } : item
      ),
      editingId: null,
      editingTitle: ''
    }));
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

  saveCurrentFile: () => {
    console.log('Save current file');
  },

  openFile: () => {
    console.log('Open file');
  }
}));
