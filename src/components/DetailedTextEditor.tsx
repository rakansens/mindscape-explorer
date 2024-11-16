import React, { useState, useRef } from 'react';
import { useMindMapStore } from '../store/mindMapStore';

interface DetailedTextEditorProps {
  nodeId: string;
  initialText: string;
}

export const DetailedTextEditor: React.FC<DetailedTextEditorProps> = ({ nodeId, initialText }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateNode } = useMindMapStore();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    updateNode(nodeId, {
      detailedText: text
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setText(initialText);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent text-white/90 text-sm outline-none resize-none min-h-[100px]"
        autoFocus
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="whitespace-pre-wrap break-words cursor-text"
    >
      {text}
    </div>
  );
};