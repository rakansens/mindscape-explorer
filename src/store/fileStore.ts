import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemItem, MindMapFile, Folder } from '../types/file';

interface FileStore {
  items: FileSystemItem[];
  activeFileId: string | null;
  editingId: string | null;
  editingTitle: string;
  expandedFolders: Set<string>;
  
  // File operations
  setActiveFileId: (id: string | null) => void;
  setActiveFile: (id: string) => void;
  addFile: (file: MindMapFile) => void;
  createFile: (title: string) => void;
  createFolder: (title: string) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<FileSystemItem>) => void;
  
  // Editing operations
  startEditing: (id: string, title: string) => void;
  saveTitle: (id: string) => void;
  cancelEditing: () => void;
  setEditingTitle: (title: string) => void;
  
  // Folder operations
  toggleFolder: (id: string) => void;
  getChildren: (parentId: string | null) => FileSystemItem[];
  
  // File system operations
  saveCurrentFile: () => void;
  openFile: () => void;
  deleteItem: (id: string) => void;
}

export const useFileStore = create<FileStore>((set, get) => ({
  items: [],
  activeFileId: null,
  editingId: null,
  editingTitle: '',
  expandedFolders: new Set(),

  setActiveFileId: (id) => set({ activeFileId: id }),
  
  setActiveFile: (id) => set({ activeFileId: id }),

  addFile: (file) => set((state) => ({
    items: [...state.items, file]
  })),

  createFile: (title) => {
    const newFile: MindMapFile = {
      id: uuidv4(),
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

  createFolder: (title) => set((state) => ({
    items: [...state.items, {
      id: uuidv4(),
      title,
      type: 'folder',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
    )
  })),

  startEditing: (id, title) => set({ 
    editingId: id, 
    editingTitle: title 
  }),

  saveTitle: (id) => {
    const { editingTitle } = get();
    if (editingTitle.trim()) {
      get().updateItem(id, { title: editingTitle.trim() });
    }
    set({ editingId: null, editingTitle: '' });
  },

  cancelEditing: () => set({ 
    editingId: null, 
    editingTitle: '' 
  }),

  setEditingTitle: (title) => set({ 
    editingTitle: title 
  }),

  toggleFolder: (id) => set((state) => ({
    expandedFolders: state.expandedFolders.has(id)
      ? new Set([...state.expandedFolders].filter(folderId => folderId !== id))
      : new Set([...state.expandedFolders, id])
  })),

  getChildren: (parentId) => {
    return get().items.filter(item => item.parentId === parentId);
  },

  saveCurrentFile: () => {
    console.log('Save current file not implemented');
  },

  openFile: () => {
    console.log('Open file not implemented');
  },

  deleteItem: (id) => {
    get().removeItem(id);
  }
}));