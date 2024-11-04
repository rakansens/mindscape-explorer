import React, { useState } from 'react';
import { Tooltip } from '../Tooltip';
import { useOpenAIAuth } from '../../store/openAIAuthStore';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Key, Lock, Save } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { preventEvent } from '../../utils/eventUtils';

export const APIKeyButton = () => {
  const { apiKey, setApiKey } = useOpenAIAuth();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inputKey.trim()) {
      toast({
        title: "エラー",
        description: "APIキーを入力してください",
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

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative" onClick={preventEvent}>
      <Tooltip text="OpenAI APIキー設定" position="bottom">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsVisible(!isVisible);
          }}
          className="p-2 rounded-lg hover:bg-purple-100/50 text-purple-500 transition-colors"
        >
          <Key className="w-5 h-5" />
        </button>
      </Tooltip>

      {isVisible && (
        <div 
          className="absolute right-0 mt-2 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 w-80 z-50"
          onClick={handleInputClick}
        >
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
              onClick={handleInputClick}
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