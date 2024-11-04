import React from 'react';
import { useMindMapStore } from '../../store/mindMapStore';
import { Tooltip } from '../Tooltip';
import { preventEvent } from '../../utils/eventUtils';

export const SaveLoadButtons = () => {
  const store = useMindMapStore();
  
  return (
    <div className="flex gap-1">
      <Tooltip text="マインドマップを保存" position="bottom">
        <button
          onClick={(e) => {
            preventEvent(e);
            store.saveMap();
          }}
          className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
          title="保存"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </button>
      </Tooltip>
      <Tooltip text="保存したマインドマップを復元" position="bottom">
        <button
          onClick={(e) => {
            preventEvent(e);
            store.loadMap();
          }}
          className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
          title="復元"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </Tooltip>
    </div>
  );
};