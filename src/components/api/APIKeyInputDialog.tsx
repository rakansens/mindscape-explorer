import React from 'react';
import { APIKeyInput } from './APIKeyInput';
import { useToast } from '@/hooks/use-toast';
import { ModelType } from '@/types/models';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { useApiKeyStore } from '@/store/apiKeyStore';

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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all">
        <div className="p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold mb-4">APIキー設定</h2>
          <APIKeyInput onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};