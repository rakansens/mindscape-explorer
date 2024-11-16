import React, { useState } from 'react';
import { preventEvent } from '../utils/eventUtils';
import { ExportButtons } from './toolbar/ExportButtons';
import { JsonButtons } from './toolbar/JsonButtons';
import { ModelSelector } from './toolbar/ModelSelector';
import { Tooltip } from './Tooltip';
import { BulkGeneratorForm } from './ai/BulkGeneratorForm';
import { PlusCircle } from 'lucide-react';
import { Button } from './ui/button';

export const Toolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBulkGenerator, setShowBulkGenerator] = useState(false);

  const handleToolbarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="absolute top-4 right-4 z-50"
      onClick={handleToolbarClick}
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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2 items-center backdrop-blur-sm bg-white/80 p-2 rounded-xl shadow-lg border border-blue-100">
          <div style={{ pointerEvents: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <ModelSelector />
          </div>
          <div className="w-px h-8 bg-blue-100/50" />
          <ExportButtons />
          <div className="w-px h-8 bg-blue-100/50" />
          <JsonButtons />
          <div className="w-px h-8 bg-blue-100/50" />
          <Tooltip text="一括生成" position="bottom">
            <Button
              onClick={() => setShowBulkGenerator(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            >
              <PlusCircle className="w-4 h-4" />
              <span>一括生成</span>
            </Button>
          </Tooltip>
        </div>
      </div>

      {showBulkGenerator && (
        <BulkGeneratorForm
          onClose={() => setShowBulkGenerator(false)}
          onShowAPIKeyInput={() => {}}
        />
      )}
    </div>
  );
};