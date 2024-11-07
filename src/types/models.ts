export type ModelType = 
  | 'GPT3.5' 
  | 'GPT4' 
  | 'GPT4-Turbo'
  | 'GEMINI-PRO'
  | 'GEMINI-PRO-VISION'
  | 'GEMINI-ULTRA';

export interface ModelConfig {
  type: ModelType;
  apiKey: string;
  geminiKey?: string;
}

// 環境変数から設定を取得するヘルパー関数
export const getDefaultModelConfig = (): ModelConfig => {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  console.log('Environment Variables Status:');
  console.log('OpenAI Key:', openaiKey ? 'Present' : 'Missing', openaiKey?.length);
  console.log('Gemini Key:', geminiKey ? 'Present' : 'Missing', geminiKey?.length);
  console.log('Current Model Type:', 'GPT3.5');

  const config = {
    type: 'GPT3.5' as ModelType,
    apiKey: openaiKey || '',
    geminiKey: geminiKey || ''
  };

  console.log('Final Config:', {
    type: config.type,
    hasOpenAIKey: !!config.apiKey,
    hasGeminiKey: !!config.geminiKey,
  });

  return config;
}; 