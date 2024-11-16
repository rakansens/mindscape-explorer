import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApiKeyStore } from '../store/apiKeyStore';
import { useToast } from '../hooks/use-toast';

interface APIKeyInputProps {
  onSubmit: (config: { 
    apiKey: string;
    geminiKey: string;
  }) => void;
}

export const APIKeyInput: React.FC<APIKeyInputProps> = ({ onSubmit }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const { setOpenAIKey, setGeminiKey: setGeminiKeyStore } = useApiKeyStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!openaiKey.trim() && !geminiKey.trim()) {
        throw new Error('少なくとも1つのAPIキーを入力してください');
      }

      if (openaiKey.trim()) {
        setOpenAIKey(openaiKey);
      }
      if (geminiKey.trim()) {
        setGeminiKeyStore(geminiKey);
      }

      onSubmit({
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
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex justify-end">
        <Button type="submit">
          設定を保存
        </Button>
      </div>
    </form>
  );
};