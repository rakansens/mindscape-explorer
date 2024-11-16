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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-xl font-semibold mb-4">APIキー設定</h2>
        <APIKeyInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
};