import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AIGeneratorForm } from './AIGeneratorForm';
import { Button } from "@/components/ui/button";

export const AIGeneratorButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button 
            size="icon"
            className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600"
          >
            <Sparkles className="h-6 w-6 text-white" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[400px] p-4"
          side="top"
          align="end"
          sideOffset={16}
        >
          <AIGeneratorForm onClose={() => setIsOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
};