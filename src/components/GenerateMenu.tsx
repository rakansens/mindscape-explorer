import React, { useState, useCallback, memo } from 'react';
import { useOpenAI } from '../utils/openai';
import { useMindMapStore } from '../store/mindMapStore';
import { useViewStore } from '../store/viewStore';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Sparkles, Plus } from 'lucide-react';
import { useNodeGenerator } from '../components/mindmap/NodeGenerator';
import { parseTopicTree } from '../utils/parseUtils';
import { calculateNewNodePosition } from '../utils/nodePositionUtils';
import { GenerateMenuContent } from './generate/GenerateMenuContent';
import { useGenerateMenuState } from './generate/GenerateMenuState';

interface GenerateMenuProps {
  nodeId: string;
  onVisibilityChange?: (isVisible: boolean) => void;
}

export const GenerateMenu = memo(({ nodeId, onVisibilityChange }: GenerateMenuProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { generateSubTopics } = useOpenAI();
  const { nodes, edges, addNode, updateNode } = useMindMapStore();
  const { fitView } = useViewStore();
  const { toast } = useToast();
  const { generateNodes } = useNodeGenerator();
  const { isVisible, setVisible } = useGenerateMenuState();

  const handleGenerate = async (mode: 'quick' | 'detailed' | 'why' | 'how' | 'regenerate' | 'ideas') => {
    try {
      setIsLoading(true);
      const currentNode = nodes.find(n => n.id === nodeId);
      if (!currentNode) return;

      updateNode(nodeId, {
        isGenerating: true,
        label: '生成中...'
      });

      const response = await generateSubTopics(currentNode.data.label, { mode });
      const hierarchyItems = parseTopicTree(response);
      
      updateNode(nodeId, {
        label: currentNode.data.label,
        isGenerating: false
      });

      await generateNodes(currentNode, hierarchyItems, () => {
        fitView();
      });

      toast({
        title: "生成完了",
        description: "新しいノードが生成されました",
      });

    } catch (error) {
      console.error('生成エラー:', error);
      toast({
        title: "エラー",
        description: "サブトピックの生成に失敗しました。",
        variant: "destructive",
      });
      
      const currentNode = nodes.find(n => n.id === nodeId);
      if (currentNode) {
        updateNode(nodeId, {
          label: currentNode.data.label,
          isGenerating: false
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNode = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentNode = nodes.find(n => n.id === nodeId);
    if (currentNode) {
      const newPosition = calculateNewNodePosition(currentNode, nodes, edges);
      addNode(currentNode, '新しいトピック', newPosition);
      fitView();
    }
  }, [nodeId, nodes, edges, addNode, fitView]);

  const handleMouseEnter = useCallback(() => {
    setVisible(true, nodeId);
    onVisibilityChange?.(true);
  }, [nodeId, onVisibilityChange, setVisible]);

  const handleMouseLeave = useCallback(() => {
    setVisible(false, null);
    onVisibilityChange?.(false);
  }, [onVisibilityChange, setVisible]);

  return (
    <div 
      className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full flex flex-col gap-1 z-50" 
      onClick={e => e.stopPropagation()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white"
          onClick={handleAddNode}
          onMouseDown={e => e.stopPropagation()}
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white"
        >
          <Sparkles className="w-4 h-4 text-gray-600" />
        </Button>
      </div>

      {isVisible && (
        <GenerateMenuContent
          isLoading={isLoading}
          onGenerate={handleGenerate}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
});

GenerateMenu.displayName = 'GenerateMenu';