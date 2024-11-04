import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AIGeneratorForm } from './AIGeneratorForm';
import { Button } from "@/components/ui/button";

export const AIGeneratorButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="icon"
            className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 shadow-lg"
          >
            <Sparkles className="h-6 w-6 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[400px] p-4">
          <AIGeneratorForm onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};