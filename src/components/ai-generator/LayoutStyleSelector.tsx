import React from 'react';
import { useAIGenerator } from './useAIGenerator';

export const LayoutStyleSelector = () => {
  const { layoutStyle, setLayoutStyle } = useAIGenerator();

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        レイアウトスタイル
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => setLayoutStyle('horizontal')}
          className={`flex-1 px-3 py-2 rounded border ${
            layoutStyle === 'horizontal'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          横方向
        </button>
        <button
          onClick={() => setLayoutStyle('radial')}
          className={`flex-1 px-3 py-2 rounded border ${
            layoutStyle === 'radial'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          放射状
        </button>
      </div>
    </div>
  );
};