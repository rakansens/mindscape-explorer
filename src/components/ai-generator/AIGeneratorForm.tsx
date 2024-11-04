import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAIGenerator } from './useAIGenerator';
import { Button } from '@/components/ui/button';

interface AIGeneratorFormProps {
  onClose?: () => void;
}

export const AIGeneratorForm = ({ onClose }: AIGeneratorFormProps) => {
  const [prompt, setPrompt] = useState('');
  const { handleGenerate, isLoading } = useAIGenerator();

  const onSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    await handleGenerate(prompt);
    setPrompt('');
    onClose?.();
  };

  return (
    <div className="bg-white rounded-lg">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="探求したいテーマを入力してください..."
        className="w-full h-32 p-2 border rounded mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2">
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              <span>生成中...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} className="mr-2" />
              <span>マインドマップを生成</span>
            </>
          )}
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
        >
          キャンセル
        </Button>
      </div>
    </div>
  );
};