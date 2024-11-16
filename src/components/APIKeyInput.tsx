import React, { useState, useEffect } from 'react';
import { ModelType } from '../types/models';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { useApiKeyStore } from '../store/apiKeyStore';
import { useToast } from '../hooks/use-toast';

interface APIKeyInputProps {
  onSubmit: (config: { 
    type: ModelType;
    apiKey: string;
    geminiKey?: string;
  }) => void;
}

export const APIKeyInput: React.FC<APIKeyInputProps> = ({ onSubmit }) => {
  const [selectedModel, setSelectedModel] = useState<ModelType>('GPT3.5');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const { setOpenAIKey, setGeminiKey: setGeminiKeyStore } = useApiKeyStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedModel.includes('GEMINI')) {
        if (!geminiKey.trim()) {
          throw new Error('Gemini APIキーを入力してください');
        }
        setGeminiKeyStore(geminiKey);
      } else {
        if (!openaiKey.trim()) {
          throw new Error('OpenAI APIキーを入力してください');
        }
        setOpenAIKey(openaiKey);
      }

      onSubmit({
        type: selectedModel,
        apiKey: openaiKey,
        geminiKey: geminiKey
      });

      toast({
        title: "APIキーを設定しました",
        description: "APIキーの設定が完了しました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "APIキーの設定に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">APIキー設定</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              使用するモデル
            </label>
            <Select
              value={selectedModel}
              onValueChange={(value) => setSelectedModel(value as ModelType)}
            >
              <optgroup label="OpenAI GPT">
                <option value="GPT3.5">GPT-3.5</option>
                <option value="GPT4">GPT-4</option>
                <option value="GPT4-Turbo">GPT-4 Turbo</option>
              </optgroup>
              <optgroup label="Google Gemini">
                <option value="GEMINI-PRO">Gemini Pro</option>
                <option value="GEMINI-PRO-VISION">Gemini Pro Vision</option>
                <option value="GEMINI-ULTRA">Gemini Ultra</option>
              </optgroup>
            </Select>
          </div>

          {selectedModel.includes('GEMINI') ? (
            <div>
              <label className="block text-sm font-medium mb-1">
                Google Cloud APIキー
              </label>
              <Input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Google Cloud APIキーを入力"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">
                OpenAI APIキー
              </label>
              <Input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="OpenAI APIキーを入力"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit">
            設定を保存
          </Button>
        </div>
      </form>
    </div>
  );
};
