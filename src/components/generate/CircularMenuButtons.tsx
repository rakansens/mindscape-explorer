import React from 'react';
import { Button } from '../ui/button';
import {
  Zap,
  BookOpen,
  HelpCircle,
  ListTodo,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CircularMenuButtonsProps {
  isLoading: boolean;
  onGenerate: (mode: 'quick' | 'detailed' | 'why' | 'how') => void;
  isOpen: boolean;
}

export const CircularMenuButtons: React.FC<CircularMenuButtonsProps> = ({
  isLoading,
  onGenerate,
  isOpen,
}) => {
  const buttons = [
    { icon: Zap, mode: 'quick' as const, angle: 0 },
    { icon: BookOpen, mode: 'detailed' as const, angle: 90 },
    { icon: HelpCircle, mode: 'why' as const, angle: 180 },
    { icon: ListTodo, mode: 'how' as const, angle: 270 },
  ];

  return (
    <div className="relative">
      {buttons.map(({ icon: Icon, mode, angle }) => {
        const radians = (angle * Math.PI) / 180;
        const radius = 60; // Distance from center
        const x = Math.cos(radians) * radius;
        const y = Math.sin(radians) * radius;

        return (
          <Button
            key={mode}
            variant="ghost"
            size="icon"
            className={cn(
              "w-8 h-8 p-0 absolute rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white",
              "transition-all duration-300 transform",
              isOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-0",
              "hover:scale-110"
            )}
            style={{
              transform: isOpen
                ? `translate(${x}px, ${y}px)`
                : 'translate(0px, 0px)',
              transitionDelay: `${angle * 0.5}ms`,
            }}
            onClick={() => onGenerate(mode)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
            ) : (
              <Icon className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        );
      })}
    </div>
  );
};