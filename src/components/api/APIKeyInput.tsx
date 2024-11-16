import React, { useState } from 'react';
import { ModelType } from '../../types/models';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface APIKeyInputProps {
  onSubmit: (config: { 
    type: ModelType;
    apiKey: string;
    geminiKey?: string;
  }) => void;
}

export const APIKeyInput: React.FC<APIKeyInputProps> = ({ onSubmit }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: openaiKey ? 'GPT4' : 'GEMINI-PRO',
      apiKey: openaiKey,
      geminiKey: geminiKey
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="openai-key">OpenAI APIキー</Label>
        <Input
          id="openai-key"
          type="password"
          value={openaiKey}
          onChange={(e) => setOpenaiKey(e.target.value)}
          placeholder="sk-..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="gemini-key">Google Cloud APIキー</Label>
        <Input
          id="gemini-key"
          type="password"
          value={geminiKey}
          onChange={(e) => setGeminiKey(e.target.value)}
          placeholder="..."
          className="mt-1"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">
          設定を保存
        </Button>
      </div>
    </form>
  );
};