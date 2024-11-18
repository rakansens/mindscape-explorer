import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export type FileType = 'file' | 'folder';

export interface FileSystemItemBase {
  id: string;
  title: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MindMapFile extends FileSystemItemBase {
  type: 'file';
  data?: {
    nodes: Node[];
    edges: Edge[];
  };
}

export interface Folder extends FileSystemItemBase {
  type: 'folder';
}

export type FileSystemItem = MindMapFile | Folder;

interface FileStore {
  items: FileSystemItem[];
  activeFileId: string | null;
  setActiveFileId: (id: string | null) => void;
  addFile: (title: string, parentId: string | null) => void;
  addFolder: (title: string, parentId: string | null) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<FileSystemItem>) => void;
  saveCurrentFile: () => void;
  openFile: () => void;
}

export const useFileStore = create<FileStore>((set) => ({
  items: [],
  activeFileId: null,

  setActiveFileId: (id) => set({ activeFileId: id }),

  addFile: (title, parentId) => set((state) => ({
    items: [...state.items, {
      id: uuidv4(),
      title,
      parentId,
      type: 'file' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: { nodes: [], edges: [] }
    }]
  })),

  addFolder: (title, parentId) => set((state) => ({
    items: [...state.items, {
      id: uuidv4(),
      title,
      parentId,
      type: 'folder' as const,
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

  saveCurrentFile: () => {
    console.log('Save current file not implemented');
  },

  openFile: () => {
    console.log('Open file not implemented');
  }
}));