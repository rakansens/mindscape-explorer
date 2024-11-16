import React from 'react';
import { Button } from '../ui/button';
import {
  Plus,
  Zap,
  BookOpen,
  HelpCircle,
  ListTodo,
  RefreshCw,
  Lightbulb,
  Loader2
} from 'lucide-react';

interface GenerateMenuButtonsProps {
  isLoading: boolean;
  onGenerate: (mode: 'quick' | 'detailed' | 'why' | 'how' | 'regenerate' | 'ideas') => void;
  onAddNode: () => void;
}

export const GenerateMenuButtons: React.FC<GenerateMenuButtonsProps> = ({
  isLoading,
  onGenerate,
  onAddNode,
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 p-0"
        onClick={onAddNode}
      >
        <Plus className="h-4 w-4 text-gray-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 p-0"
        onClick={() => onGenerate('quick')}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <Zap className="h-4 w-4 text-gray-600" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 p-0"
        onClick={() => onGenerate('detailed')}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <BookOpen className="h-4 w-4 text-gray-600" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 p-0"
        onClick={() => onGenerate('why')}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <HelpCircle className="h-4 w-4 text-gray-600" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 p-0"
        onClick={() => onGenerate('how')}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <ListTodo className="h-4 w-4 text-gray-600" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 p-0"
        onClick={() => onGenerate('ideas')}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <Lightbulb className="h-4 w-4 text-gray-600" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 p-0"
        onClick={() => onGenerate('regenerate')}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <RefreshCw className="h-4 w-4 text-gray-600" />}
      </Button>
    </div>
  );
};