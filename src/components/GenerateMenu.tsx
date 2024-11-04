import React from 'react';
import { useOpenAI } from '../utils/openai';
import { useMindMapStore } from '../store/mindMapStore';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface GenerateMenuProps {
  nodeId: string;
}

export const GenerateMenu: React.FC<GenerateMenuProps> = ({ nodeId }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { generateSubTopics, apiKey } = useOpenAI();
  const { nodes, addNode } = useMindMapStore();
  const { toast } = useToast();

  const handleGenerate = async (mode: 'quick' | 'detailed') => {
    if (!apiKey) {
      toast({
        title: "エラー",
        description: "OpenAI APIキーを設定してください",
        variant: "destructive",
      });
      return;
    }

    const currentNode = nodes.find(n => n.id === nodeId);
    if (!currentNode) return;

    setIsLoading(true);
    try {
      const response = await generateSubTopics(currentNode.data.label, {
        mode: mode,
        quickType: mode === 'quick' ? 'simple' : 'detailed'
      });

      if (response.children) {
        for (const child of response.children) {
          const newNode = await addNode(currentNode, child.label);
          if (mode === 'detailed' && child.description) {
            // Update the node with detailed text
            const updatedNode = {
              ...newNode,
              data: {
                ...newNode.data,
                detailedText: child.description
              }
            };
            // Update the node in the store
            // Note: This assumes you have an updateNode function in your store
            // You'll need to implement this if it doesn't exist
          }
        }
      }

      toast({
        title: "生成完了",
        description: "新しいノードを生成しました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "ノードの生成に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-2 min-w-[200px] z-50">
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => handleGenerate('quick')}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          クイック生成
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => handleGenerate('detailed')}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          詳細生成
        </Button>
      </div>
    </div>
  );
};