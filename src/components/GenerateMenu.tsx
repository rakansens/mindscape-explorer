import React from 'react';
import { useOpenAI } from '../utils/openai';
import { useMindMapStore } from '../store/mindMapStore';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Loader2, ToggleLeft, List } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface GenerateMenuProps {
  nodeId: string;
}

export const GenerateMenu: React.FC<GenerateMenuProps> = ({ nodeId }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { generateSubTopics, apiKey } = useOpenAI();
  const { nodes, addNode, updateNode } = useMindMapStore();
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
    if (!currentNode) {
      toast({
        title: "エラー",
        description: "ノードが見つかりません",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await generateSubTopics(currentNode.data.label, {
        mode: mode,
        quickType: mode === 'quick' ? 'simple' : 'detailed',
        structure: {
          level1: 3,
          level2: 2,
          level3: 1
        }
      });

      if (!response || !response.children || !Array.isArray(response.children)) {
        throw new Error('Invalid response format from API');
      }

      let addedNodes = 0;
      let yOffset = 0;

      for (const [index, child] of response.children.entries()) {
        if (!child.label) continue;

        try {
          const childPosition = {
            x: currentNode.position.x + 250,
            y: currentNode.position.y + (index - 1) * 150
          };

          const newNode = await addNode(currentNode, child.label, childPosition);
          
          if (mode === 'detailed' && child.description) {
            updateNode(newNode.id, {
              ...newNode,
              data: {
                ...newNode.data,
                detailedText: child.description,
                isCollapsed: true
              }
            });
          }

          if (child.children && Array.isArray(child.children)) {
            for (const [grandChildIndex, grandChild] of child.children.entries()) {
              if (!grandChild.label) continue;

              const grandChildPosition = {
                x: childPosition.x + 250,
                y: childPosition.y + (grandChildIndex - 0.5) * 100
              };

              const grandChildNode = await addNode(newNode, grandChild.label, grandChildPosition);

              if (grandChild.children && Array.isArray(grandChild.children)) {
                for (const greatGrandChild of grandChild.children) {
                  if (!greatGrandChild.label) continue;

                  const greatGrandChildPosition = {
                    x: grandChildPosition.x + 250,
                    y: grandChildPosition.y
                  };

                  await addNode(grandChildNode, greatGrandChild.label, greatGrandChildPosition);
                }
              }
            }
          }

          addedNodes++;
        } catch (error) {
          console.error('Failed to add node:', error);
        }
      }

      if (addedNodes > 0) {
        toast({
          title: "生成完了",
          description: `${addedNodes}個のノードを生成しました`,
        });
      } else {
        toast({
          title: "警告",
          description: "ノードを生成できませんでした",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "ノードの生成に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-2 min-w-[200px] z-50 flex gap-2">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleGenerate('quick')}
            disabled={isLoading}
            className="w-9 h-9"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-40">
          クイック生成
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleGenerate('detailed')}
            disabled={isLoading}
            className="w-9 h-9"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-40">
          詳細生成
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};