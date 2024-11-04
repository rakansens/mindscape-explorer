import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAIGenerator } from './useAIGenerator';
import { LayoutStyleSelector } from './LayoutStyleSelector';

export const AIGeneratorForm = () => {
  const [prompt, setPrompt] = useState('');
  const { handleGenerate, isLoading } = useAIGenerator();

  const onSubmit = async () => {
    await handleGenerate(prompt);
    setPrompt('');
  };

  return (
    <div className="bg-white rounded-lg">
      <LayoutStyleSelector />
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="探求したいテーマを入力してください..."
        className="w-full h-32 p-2 border rounded mb-2 resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>生成中...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>マインドマップを生成</span>
            </>
          )}
        </button>
        <button
          onClick={() => setPrompt('')}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};