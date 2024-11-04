import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AIGeneratorForm } from './AIGeneratorForm';

export const AIGeneratorButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger>
          <button 
            className="p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 shadow-lg transition-colors duration-200"
          >
            <Sparkles size={24} />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[400px] p-4 z-[101]"
          side="top"
          align="end"
          sideOffset={16}
        >
          <div className="relative">
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <AIGeneratorForm onClose={() => setIsOpen(false)} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};