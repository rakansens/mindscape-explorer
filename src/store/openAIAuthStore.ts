import { create } from 'zustand';
import OpenAI from 'openai';

type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo-preview';

interface OpenAIAuthStore {
  apiKey: string | null;
  openai: OpenAI | null;
  model: OpenAIModel;
  setApiKey: (key: string) => void;
  setModel: (model: OpenAIModel) => void;
}

const initializeOpenAI = (key: string) => {
  return new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true,
    timeout: 30000,
  });
};

// 環境変数からAPIキーを取得
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// OpenAIクライアントを初期化
const initialOpenAI = API_KEY ? initializeOpenAI(API_KEY) : null;

export const useOpenAIAuth = create<OpenAIAuthStore>()((set) => ({
  apiKey: API_KEY || null,
  openai: initialOpenAI,
  model: 'gpt-3.5-turbo',
  setApiKey: (key: string) => {
    const openai = initializeOpenAI(key);
    set({ apiKey: key, openai });
  },
  setModel: (model: OpenAIModel) => {
    set({ model });
  },
}));

// 初期化時にAPIキーの状態をログ出力
console.log('OpenAI API Key Status:', API_KEY ? 'Loaded from ENV' : 'Not found in ENV');