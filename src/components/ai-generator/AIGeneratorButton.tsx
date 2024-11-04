import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AIGeneratorForm } from './AIGeneratorForm';

export const AIGeneratorButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="fixed bottom-4 right-4" 
      style={{ 
        zIndex: 9999,
        pointerEvents: 'auto',
        position: 'relative'
      }}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button 
            className="p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 shadow-lg transition-colors duration-200"
            style={{ pointerEvents: 'auto' }}
          >
            <Sparkles size={24} />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[400px] p-4"
          style={{ 
            pointerEvents: 'auto',
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: '1rem'
          }}
        >
          <AIGeneratorForm />
        </PopoverContent>
      </Popover>
    </div>
  );
};