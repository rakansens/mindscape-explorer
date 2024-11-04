import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useOpenAIAuth } from '@/store/openAIAuthStore';
import { Key, Lock, Save } from 'lucide-react';
import { useToast } from './ui/use-toast';

export const OpenAIKeyInput = () => {
  const { apiKey, setApiKey } = useOpenAIAuth();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!inputKey.trim()) {
      toast({
        title: "エラー",
        description: "APIキーを入力してください",
        variant: "destructive",
      });
      return;
    }
    setApiKey(inputKey);
    toast({
      title: "保存完了",
      description: "APIキーを保存しました",
    });
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsVisible(!isVisible)}
        className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
      >
        <Key className="h-4 w-4" />
      </Button>

      {isVisible && (
        <div className="absolute right-0 mt-2 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 w-80">
          <div className="flex gap-2 items-center mb-2">
            <Lock className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium">OpenAI APIキー</h3>
          </div>
          <div className="flex gap-2">
            <Input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleSave}
              className="shrink-0"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};