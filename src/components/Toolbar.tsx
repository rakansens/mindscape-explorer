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
      className="absolute top-4 right-4 z-50 flex items-center gap-4"
      onClick={handleToolbarClick}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex items-center gap-2 backdrop-blur-sm bg-white/80 p-2 rounded-xl shadow-lg border border-blue-100">
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

      {showBulkGenerator && (
        <BulkGeneratorForm
          onClose={() => setShowBulkGenerator(false)}
          onShowAPIKeyInput={() => {}}
        />
      )}
    </div>
  );
};