import React from 'react';
import { Button } from '../ui/button';
import { Tooltip } from '../Tooltip';
import {
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
}

export const GenerateMenuButtons: React.FC<GenerateMenuButtonsProps> = ({
  isLoading,
  onGenerate,
}) => {
  return (
    <div className="flex gap-2">
      <Tooltip text="クイック生成：簡単な展開" position="top">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0"
          onClick={() => onGenerate('quick')}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <Zap className="h-4 w-4 text-gray-600" />}
        </Button>
      </Tooltip>

      <Tooltip text="詳細生成：深い展開" position="top">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0"
          onClick={() => onGenerate('detailed')}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <BookOpen className="h-4 w-4 text-gray-600" />}
        </Button>
      </Tooltip>

      <Tooltip text="Why?：理由の展開" position="top">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0"
          onClick={() => onGenerate('why')}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <HelpCircle className="h-4 w-4 text-gray-600" />}
        </Button>
      </Tooltip>

      <Tooltip text="How?：方法の展開" position="top">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0"
          onClick={() => onGenerate('how')}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <ListTodo className="h-4 w-4 text-gray-600" />}
        </Button>
      </Tooltip>

      <Tooltip text="アイデア生成" position="top">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0"
          onClick={() => onGenerate('ideas')}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <Lightbulb className="h-4 w-4 text-gray-600" />}
        </Button>
      </Tooltip>

      <Tooltip text="再生成" position="top">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0"
          onClick={() => onGenerate('regenerate')}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <RefreshCw className="h-4 w-4 text-gray-600" />}
        </Button>
      </Tooltip>
    </div>
  );
};