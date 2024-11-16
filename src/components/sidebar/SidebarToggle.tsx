import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <div 
      className={cn(
        "absolute -right-8 top-1/2 -translate-y-1/2 transition-all duration-300",
        !isOpen && "translate-x-2"
      )}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className={cn(
          "h-8 w-8 rounded-full p-0 border shadow-md",
          "hover:bg-accent hover:translate-x-0.5 transition-all",
          "flex items-center justify-center",
          !isOpen && "bg-background hover:bg-accent/80"
        )}
        aria-label={isOpen ? "サイドバーを閉じる" : "サイドバーを開く"}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};