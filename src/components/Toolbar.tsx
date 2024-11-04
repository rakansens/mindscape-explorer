import React, { useState } from 'react';
import { preventEvent } from '../utils/eventUtils';
import { SaveLoadButtons } from './toolbar/SaveLoadButtons';
import { ExportButtons } from './toolbar/ExportButtons';
import { JsonButtons } from './toolbar/JsonButtons';
import { Tooltip } from './Tooltip';

export const Toolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="absolute top-4 right-4 z-50"
      onMouseDown={preventEvent}
      onPointerDown={preventEvent}
      onClick={preventEvent}
      onDragStart={preventEvent}
      style={{ pointerEvents: 'auto' }}
    >
      <Tooltip text="ツールメニューを開く" position="left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg
            border border-blue-100 hover:border-blue-300
            transform transition-all duration-300
            ${isOpen ? 'bg-blue-50 border-blue-300' : ''}
          `}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        >
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </Tooltip>

      <div
        className={`
          absolute top-0 right-16
          transform transition-all duration-300 origin-right
          flex items-center gap-2
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        `}
      >
        <div className="flex gap-2 items-center backdrop-blur-sm bg-white/80 p-2 rounded-xl shadow-lg border border-blue-100">
          <SaveLoadButtons />
          <div className="w-px h-8 bg-blue-100/50" />
          
          <ExportButtons />
          <div className="w-px h-8 bg-blue-100/50" />
          
          <JsonButtons />
        </div>
      </div>
    </div>
  );
};