import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
        });
        set({ apiKey: key, openai });
      },
    }),
    {
      name: 'openai-auth-storage',
    }
  )
);