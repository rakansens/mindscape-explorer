import { create } from 'zustand';

interface MenuStore {
  activeMenuNodeId: string | null;
  setActiveMenuNodeId: (id: string | null) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  activeMenuNodeId: null,
  setActiveMenuNodeId: (id) => set({ activeMenuNodeId: id }),
}));