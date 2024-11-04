import React from 'react';
import { useOpenAI } from '../utils/openai';
import { useMindMapStore } from '../store/mindMapStore';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Loader2, Zap, BookOpen, HelpCircle, ListTodo, RefreshCw } from 'lucide-react';
import { getNodeProperties } from '../utils/nodeUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface GenerateMenuProps {
  nodeId: string;
}

export const GenerateMenu: React.FC<GenerateMenuProps> = ({ nodeId }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { generateSubTopics, apiKey } = useOpenAI();
  const { nodes, edges, addNode, updateNode, removeChildNodes } = useMindMapStore();
  const { toast } = useToast();

  const handleGenerate = async (mode: 'quick' | 'detailed' | 'why' | 'how' | 'regenerate') => {
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
      const childNodes = mode === 'regenerate' ? 
        nodes.filter(node => {
          const parentEdge = edges.find(edge => edge.target === node.id);
          return parentEdge?.source === nodeId;
        }) : [];

      const childProperties = childNodes.map(node => ({
        id: node.id,
        properties: getNodeProperties(node)
      }));

      if (mode === 'regenerate') {
        removeChildNodes(nodeId);
      }

      const effectiveMode = mode === 'regenerate' ? 
        (currentNode.data.isTask ? 'how' : 
         currentNode.data.detailedText ? 'detailed' : 'quick') : mode;

      const response = await generateSubTopics(currentNode.data.label, {
        mode: effectiveMode,
        quickType: effectiveMode === 'quick' ? 'simple' : 'detailed',
        nodeContext: currentNode.data.label,
        structure: {
          level1: childProperties.length || 3,
          level2: 2,
          level3: 1
        }
      });

      if (!response || !response.children || !Array.isArray(response.children)) {
        throw new Error('Invalid response format from API');
      }

      let addedNodes = 0;
      const baseYOffset = -150 * (response.children.length - 1) / 2;

      for (const [index, child] of response.children.entries()) {
        if (!child.label) continue;

        try {
          const childPosition = {
            x: currentNode.position.x + 250,
            y: currentNode.position.y + baseYOffset + index * 150
          };

          const newNode = await addNode(currentNode, child.label, childPosition);
          
          if (mode === 'regenerate' && childProperties[index]) {
            const originalProperties = childProperties[index].properties;
            updateNode(newNode.id, {
              ...newNode,
              data: {
                ...newNode.data,
                ...originalProperties,
                detailedText: child.description || originalProperties.detailedText
              }
            });
          } else if ((effectiveMode === 'detailed' || effectiveMode === 'why' || effectiveMode === 'how') && child.description) {
            updateNode(newNode.id, {
              ...newNode,
              data: {
                ...newNode.data,
                detailedText: child.description,
                isCollapsed: true,
                isTask: effectiveMode === 'how'
              }
            });
          }

          if (child.children && Array.isArray(child.children)) {
            const childBaseYOffset = -100 * (child.children.length - 1) / 2;
            
            for (const [grandChildIndex, grandChild] of child.children.entries()) {
              if (!grandChild.label) continue;

              const grandChildPosition = {
                x: childPosition.x + 250,
                y: childPosition.y + childBaseYOffset + grandChildIndex * 100
              };

              const grandChildNode = await addNode(newNode, grandChild.label, grandChildPosition);

              if (mode === 'why') {
                updateNode(grandChildNode.id, {
                  ...grandChildNode,
                  data: {
                    ...grandChildNode.data,
                    detailedText: grandChild.description,
                    isCollapsed: true
                  }
                });
              }
              else if (mode === 'how') {
                updateNode(grandChildNode.id, {
                  ...grandChildNode,
                  data: {
                    ...grandChildNode.data,
                    detailedText: grandChild.description,
                    isCollapsed: true,
                    isTask: true,
                    isCompleted: false
                  }
                });
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
          title: mode === 'regenerate' ? "再生成完了" : "生成完了",
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
    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-2 min-w-[120px] z-50">
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10"
                onClick={() => handleGenerate('quick')}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>クイック生成</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10"
                onClick={() => handleGenerate('detailed')}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <BookOpen className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>詳細生成</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10"
                onClick={() => handleGenerate('why')}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <HelpCircle className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>WHY分析</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10"
                onClick={() => handleGenerate('how')}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ListTodo className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>HOW分析</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10"
                onClick={() => handleGenerate('regenerate')}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>子ノードを再生成</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};