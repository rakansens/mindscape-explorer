import React, { useState, useEffect } from 'react';
import { Key, Lock, Save } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useOpenAIAuth } from '../store/openAIAuthStore';
import { useToast } from '../hooks/use-toast';

export const APIKeyInput = () => {
  const { apiKey, setApiKey } = useOpenAIAuth();
  const [inputKey, setInputKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (apiKey) {
      setInputKey(apiKey);
    }
  }, [apiKey]);

  const handleSave = () => {
    if (!inputKey.trim()) {
      toast({
        title: "エラー",
        description: "APIキーを入力してください",
        variant: "destructive",
      });
      return;
    }

    if (!inputKey.startsWith('sk-')) {
      toast({
        title: "エラー",
        description: "有効なAPIキーを入力してください",
        variant: "destructive",
      });
      return;
    }

    setApiKey(inputKey);
    setIsVisible(false);
    toast({
      title: "保存完了",
      description: "APIキーを保存しました",
    });
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg 
          border border-purple-100 hover:border-purple-300 hover:bg-purple-50
          transform transition-all duration-300"
      >
        <Key className="w-6 h-6 text-purple-500" />
      </button>

      {isVisible && (
        <div className="absolute left-0 mt-2 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 w-80">
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