import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOpenAI } from '../utils/openai';
import { useToast } from '../hooks/use-toast';
import { useMindMapStore } from '../store/mindMapStore';

export const AIGenerator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { generateSubTopics, apiKey } = useOpenAI();
  const { nodes, addNode, updateNode } = useMindMapStore();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!apiKey) {
      toast({
        title: "エラー",
        description: "OpenAI APIキーを設定してください",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "エラー",
        description: "テーマを入力してください",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await generateSubTopics(prompt, {
        mode: 'quick',
        quickType: 'simple'
      });

      const rootNode = nodes.find(n => n.id === '1');
      if (rootNode) {
        for (const child of response.children || []) {
          const newNode = await addNode(rootNode, child.label);
          if (child.children) {
            for (const grandChild of child.children) {
              await addNode(newNode, grandChild.label);
            }
          }
        }
      }

      setIsOpen(false);
      setPrompt('');
      toast({
        title: "生成完了",
        description: "マインドマップを生成しました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "生成に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="bg-white rounded-lg">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="探求したいテーマを入力してください..."
              className="w-full h-32 p-2 border rounded mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="mr-2" />
                    <span>マインドマップを生成</span>
                  </>
                )}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
              >
                キャンセル
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};