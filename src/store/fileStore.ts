import { create } from 'zustand';
import { FileSystemItem, MindMapFile, Folder } from '../types/file';
import { persist } from 'zustand/middleware';
import { useMindMapStore } from './mindMapStore';

interface FileStore {
  items: FileSystemItem[];
  activeFileId: string | null;
  isDirty: boolean;  // 未保存の変更があるかどうか
  addFile: (file: MindMapFile, parentId?: string | null) => void;
  addFolder: (folder: Folder) => void;
  removeItem: (id: string) => void;
  moveItem: (itemId: string, newParentId: string | null) => void;
  setActiveFile: (id: string) => void;
  updateItem: (id: string, updates: Partial<FileSystemItem>) => void;
  getChildren: (parentId: string | null) => FileSystemItem[];
  getPath: (itemId: string) => FileSystemItem[];
  setDirty: (isDirty: boolean) => void;
  autoSave: () => void;
}

const initialFile: MindMapFile = {
  id: '1',
  title: '新しいマインドマップ',
  type: 'file',
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  data: {
    nodes: [{
      id: '1',
      type: 'custom',
      position: { x: window.innerWidth / 2 - 75, y: window.innerHeight / 3 },
      data: { label: 'メインテーマ' }
    }],
    edges: []
  }
};

export const useFileStore = create<FileStore>()(
  persist(
    (set, get) => ({
      items: [initialFile],
      activeFileId: '1',
      isDirty: false,

      setDirty: (isDirty) => set({ isDirty }),

      autoSave: () => {
        const { activeFileId, items, isDirty } = get();
        if (!activeFileId || !isDirty) return;

        const activeFile = items.find(item => item.id === activeFileId);
        if (!activeFile || activeFile.type !== 'file') return;

        const { nodes, edges } = useMindMapStore.getState();

        set((state) => ({
          items: state.items.map(item =>
            item.id === activeFileId
              ? { 
                  ...item, 
                  updatedAt: new Date(),
                  data: { nodes, edges }
                }
              : item
          ),
          isDirty: false
        }));
      },

      addFile: (file, parentId = null) => {
        set((state) => ({
          items: [...state.items, { ...file, parentId }],
          activeFileId: file.id
        }));
      },

      addFolder: (folder) => {
        set((state) => ({
          items: [...state.items, folder]
        }));
      },

      removeItem: (id) => {
        set((state) => {
          // 再帰的に子アイテムも削除
          const itemsToRemove = new Set<string>();
          const collectItems = (itemId: string) => {
            itemsToRemove.add(itemId);
            state.items
              .filter(item => item.parentId === itemId)
              .forEach(child => collectItems(child.id));
          };
          collectItems(id);

          return {
            items: state.items.filter(item => !itemsToRemove.has(item.id)),
            activeFileId: state.activeFileId === id ? null : state.activeFileId
          };
        });
      },

      moveItem: (itemId, newParentId) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId
              ? { ...item, parentId: newParentId }
              : item
          )
        }));
      },

      setActiveFile: (id) => {
        set({ activeFileId: id });
      },

      updateItem: (id: string, updates: Partial<FileSystemItem>) => {
        set((state) => {
          const item = state.items.find(item => item.id === id);
          if (!item) return state;

          const updatedItems = state.items.map(item =>
            item.id === id
              ? {
                  ...item,
                  ...updates,
                  type: item.type, // 元の type を保持
                  updatedAt: new Date()
                }
              : item
          );

          return {
            ...state,
            items: updatedItems,
            isDirty: false
          };
        });
      },

      getChildren: (parentId) => {
        return get().items.filter(item => item.parentId === parentId);
      },

      getPath: (itemId) => {
        const path: FileSystemItem[] = [];
        let currentItem = get().items.find(item => item.id === itemId);
        
        while (currentItem) {
          path.unshift(currentItem);
          currentItem = currentItem.parentId
            ? get().items.find(item => item.id === currentItem?.parentId)
            : null;
        }
        
        return path;
      },
    }),
    {
      name: 'mindmap-storage',
      partialize: (state) => ({
        items: state.items.map(item => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString()
        })),
        activeFileId: state.activeFileId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.items) {
          state.items = state.items.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }));
        }
      },
    }
  )
); 