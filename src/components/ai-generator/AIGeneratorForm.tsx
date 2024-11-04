import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAIGenerator } from './useAIGenerator';
import { LayoutStyleSelector } from './LayoutStyleSelector';
import { Button } from '@/components/ui/button';

interface AIGeneratorFormProps {
  onClose?: () => void;
}

export const AIGeneratorForm = ({ onClose }: AIGeneratorFormProps) => {
  const [prompt, setPrompt] = useState('');
  const { handleGenerate, isLoading } = useAIGenerator();

  const onSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleGenerate(prompt);
    setPrompt('');
    onClose?.();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose?.();
  };

  return (
    <div className="bg-white rounded-lg" onClick={(e) => e.stopPropagation()}>
      <LayoutStyleSelector />
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="探求したいテーマを入力してください..."
        className="w-full h-32 p-2 border rounded mb-2 resize-none"
      />
      <div className="flex gap-2">
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
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
          onClick={handleCancel}
          variant="outline"
          className="px-4 py-2"
        >
          キャンセル
        </Button>
      </div>
    </div>
  );
};