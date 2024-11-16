import { APIKeyInput } from './APIKeyInput';
import { useToast } from '@/hooks/use-toast';
import { ModelType } from '@/types/models';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 mt-20">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="pr-8">
            <h2 className="text-lg font-semibold mb-4">APIキー設定</h2>
            <APIKeyInput onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};