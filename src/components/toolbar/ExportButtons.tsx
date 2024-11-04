import React from 'react';
import { useMindMapStore } from '../../store/mindMapStore';
import { Tooltip } from '../Tooltip';
import { preventEvent } from '../../utils/eventUtils';

export const ExportButtons = () => {
  const store = useMindMapStore();
  
  return (
    <div className="flex gap-1">
      <Tooltip text="画像として保存 (PNG)" position="bottom">
        <button
          onClick={(e) => {
            preventEvent(e);
            store.exportAsImage();
          }}
          className="p-2 rounded-lg hover:bg-emerald-100/50 text-emerald-500 transition-colors"
          title="画像出力"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </Tooltip>
      <Tooltip text="PDFとして保存" position="bottom">
        <button
          onClick={(e) => {
            preventEvent(e);
            store.exportAsPDF();
          }}
          className="p-2 rounded-lg hover:bg-rose-100/50 text-rose-500 transition-colors"
          title="PDF出力"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>
      </Tooltip>
    </div>
  );
};