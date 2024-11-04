import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import { useMindMapStore } from '../../store/mindMapStore';
import { Tooltip } from '../Tooltip';
import { preventEvent } from '../../utils/eventUtils';

export const UndoRedoButtons = () => {
  const { undo, redo, canUndo, canRedo } = useMindMapStore();

  return (
    <div className="flex gap-1">
      <Tooltip text="元に戻す" position="bottom">
        <button
          onClick={(e) => {
            preventEvent(e);
            undo();
          }}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors ${
            canUndo 
              ? 'hover:bg-blue-100/50 text-blue-500' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="元に戻す"
        >
          <Undo2 className="w-5 h-5" />
        </button>
      </Tooltip>
      <Tooltip text="やり直し" position="bottom">
        <button
          onClick={(e) => {
            preventEvent(e);
            redo();
          }}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-colors ${
            canRedo 
              ? 'hover:bg-blue-100/50 text-blue-500' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="やり直し"
        >
          <Redo2 className="w-5 h-5" />
        </button>
      </Tooltip>
    </div>
  );
};