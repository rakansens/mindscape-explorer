import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import OpenAI from 'openai';

interface OpenAIAuthStore {
  apiKey: string | null;
  openai: OpenAI | null;
  setApiKey: (key: string) => void;
}

export const useOpenAIAuth = create<OpenAIAuthStore>()(
  persist(
    (set) => ({
      apiKey: null,
      openai: null,
      setApiKey: (key: string) => {
        const openai = new OpenAI({
          apiKey: key,
          dangerouslyAllowBrowser: true,
          timeout: 30000,
        });
        set({ apiKey: key, openai });
      },
    }),
    {
      name: 'openai-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ apiKey: state.apiKey }),
    }
  )
);