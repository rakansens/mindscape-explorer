import React from 'react';
import { APIKeyInput } from './api/APIKeyInput';
import { useToast } from '@/hooks/use-toast';
import { ModelType } from '@/types/models';
import { useApiKeyStore } from '@/store/apiKeyStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface APIKeyInputDialogProps {
  onSubmit: (config: { 
    type: ModelType;
    apiKey: string;
    geminiKey?: string;
  }) => void;
  onClose?: () => void;
}

export const APIKeyInputDialog: React.FC<APIKeyInputDialogProps> = ({ onSubmit, onClose }) => {
  const { toast } = useToast();
  const { setOpenAIKey, setGeminiKey } = useApiKeyStore();

  const handleSubmit = (config: { 
    type: ModelType;
    apiKey: string;
    geminiKey?: string;
  }) => {
    if (config.type.includes('GEMINI')) {
      setGeminiKey(config.geminiKey || '');
    } else {
      setOpenAIKey(config.apiKey);
    }
    
    onSubmit(config);
    toast({
      title: "設定完了",
      description: "APIキーを設定しました",
    });
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose?.()}>
      <DialogContent className="fixed bottom-0 left-0 right-0 top-auto rounded-b-none sm:bottom-auto sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>APIキー設定</DialogTitle>
        </DialogHeader>
        <APIKeyInput onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};