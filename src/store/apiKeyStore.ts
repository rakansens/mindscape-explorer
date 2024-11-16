import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiKeyState {
  openaiKey: string | null;
  geminiKey: string | null;
  setOpenAIKey: (key: string) => void;
  setGeminiKey: (key: string) => void;
  clearKeys: () => void;
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set) => ({
      openaiKey: null,
      geminiKey: null,
      setOpenAIKey: (key: string) => {
        console.log('Setting OpenAI API Key:', key ? 'Key provided' : 'No key');
        set({ openaiKey: key });
      },
      setGeminiKey: (key: string) => {
        console.log('Setting Gemini API Key:', key ? 'Key provided' : 'No key');
        set({ geminiKey: key });
      },
      clearKeys: () => set({ openaiKey: null, geminiKey: null }),
    }),
    {
      name: 'api-key-storage',
    }
  )
);