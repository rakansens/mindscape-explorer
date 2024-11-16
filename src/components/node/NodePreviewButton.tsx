import React from 'react';
import { Eye } from 'lucide-react';

interface NodePreviewButtonProps {
  onClick: () => void;
}

export const NodePreviewButton: React.FC<NodePreviewButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 bg-background rounded-full shadow-lg hover:bg-muted"
    >
      <Eye className="w-4 h-4 text-foreground" />
    </button>
  );
};