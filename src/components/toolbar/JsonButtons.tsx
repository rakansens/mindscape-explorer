import React from 'react';
import { useMindMapStore } from '../../store/mindMapStore';
import { Tooltip } from '../Tooltip';
import { preventEvent } from '../../utils/eventUtils';

export const JsonButtons = () => {
  const store = useMindMapStore();
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        store.importFromJSON(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex gap-1">
      <Tooltip text="JSONファイルとして出力" position="bottom">
        <button
          onClick={(e) => {
            preventEvent(e);
            store.exportAsJSON();
          }}
          className="p-2 rounded-lg hover:bg-violet-100/50 text-violet-500 transition-colors w-9 h-9 flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </Tooltip>
      <Tooltip text="JSONファイルから読み込み" position="bottom">
        <label
          htmlFor="import-json"
          className="p-2 rounded-lg hover:bg-amber-100/50 text-amber-500 transition-colors cursor-pointer w-9 h-9 flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </label>
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          id="import-json"
        />
      </Tooltip>
    </div>
  );
};