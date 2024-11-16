import React, { useState } from 'react';
import { ModelType } from '../../types/models';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      type: selectedModel,
      apiKey: openaiKey,
      geminiKey: geminiKey
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex justify-end">
        <Button type="submit">
          設定を保存
        </Button>
      </div>
    </form>
  );
};