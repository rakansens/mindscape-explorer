import React, { useState, useCallback } from 'react';
import { useOpenAI } from '../utils/openai';
import { useMindMapStore } from '../store/mindMapStore';
import { useViewStore } from '../store/viewStore';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Sparkles, Plus } from 'lucide-react';
import { GenerateMenuButtons } from './generate/GenerateMenuButtons';
import { useNodeGenerator } from '../components/mindmap/NodeGenerator';
import { parseTopicTree } from '../utils/parseUtils';
import { calculateNewNodePosition } from '../utils/nodePositionUtils';

interface GenerateMenuProps {
  nodeId: string;
  onMenuHover?: (isHovering: boolean) => void;
}

export const GenerateMenu = React.memo(({ nodeId, onMenuHover }: GenerateMenuProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { generateSubTopics } = useOpenAI();
  const { nodes, edges, addNode, updateNode } = useMindMapStore();
  const { fitView } = useViewStore();
  const { toast } = useToast();
  const { generateNodes } = useNodeGenerator();

  const handleGenerate = useCallback(async (mode: 'quick' | 'detailed' | 'why' | 'how' | 'regenerate' | 'ideas') => {
    try {
      setIsLoading(true);
      const currentNode = nodes.find(n => n.id === nodeId);
      if (!currentNode) return;

      updateNode(nodeId, {
        isGenerating: true,
      });

      const response = await generateSubTopics(currentNode.data.label, { mode });
      const hierarchyItems = parseTopicTree(response);
      
      updateNode(nodeId, {
        isGenerating: false
      });

      await generateNodes(currentNode, hierarchyItems, fitView);

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
      
      updateNode(nodeId, {
        isGenerating: false
      });
    } finally {
      setIsLoading(false);
    }
  }, [nodeId, nodes, updateNode, generateSubTopics, generateNodes, toast, fitView]);

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
    setShowMenu(true);
    onMenuHover?.(true);
  }, [onMenuHover]);

  const handleMouseLeave = useCallback(() => {
    setShowMenu(false);
    onMenuHover?.(false);
  }, [onMenuHover]);

  return (
    <div className="relative flex flex-col gap-1 z-50" onClick={e => e.stopPropagation()}>
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Sparkles className="w-4 h-4 text-gray-600" />
        </Button>
      </div>

      {showMenu && (
        <div
          className="absolute left-full top-0 bg-white rounded-lg shadow-lg p-2 min-w-[120px] z-[60] ml-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col gap-2">
            <GenerateMenuButtons
              isLoading={isLoading}
              onGenerate={handleGenerate}
            />
          </div>
        </div>
      )}
    </div>
  );
});

GenerateMenu.displayName = 'GenerateMenu';