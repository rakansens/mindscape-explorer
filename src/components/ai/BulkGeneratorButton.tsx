import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface BulkGeneratorButtonProps {
  onClick: () => void;
}

export function BulkGeneratorButton({ onClick }: BulkGeneratorButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
    >
      <Sparkles className="w-4 h-4" />
      <span>一括生成</span>
    </Button>
  );
}