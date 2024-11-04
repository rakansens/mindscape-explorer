import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AIGeneratorForm } from './AIGeneratorForm';

export const AIGeneratorButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button 
            className="p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 shadow-lg transition-colors duration-200"
          >
            <Sparkles size={24} />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[400px] p-4"
          side="top"
          align="end"
        >
          <AIGeneratorForm />
        </PopoverContent>
      </Popover>
    </div>
  );
};