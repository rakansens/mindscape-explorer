import React, { useState, useRef, useEffect } from 'react';
import { useOpenAI } from '../utils/openai';
import { useMindMapStore } from '../store/mindMapStore';
import { useViewStore } from '../store/viewStore';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Sparkles, Plus } from 'lucide-react';
import { CircularMenuButtons } from './generate/CircularMenuButtons';
import { GenerateCodeButton } from './code/GenerateCodeButton';
import { CodePreviewModal } from './code/CodePreviewModal';
import { useNodeGenerator } from '../components/mindmap/NodeGenerator';
import { parseTopicTree } from '../utils/parseUtils';
import { calculateNewNodePosition } from '../utils/nodePositionUtils';

interface GenerateMenuProps {
  nodeId: string;
  onMenuHover?: (isHovering: boolean) => void;
}

export const GenerateMenu: React.FC<GenerateMenuProps> = ({ nodeId, onMenuHover }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<{
    html?: string;
    css?: string;
    javascript?: string;
  }>({});

  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const { generateSubTopics } = useOpenAI();
  const { nodes, edges, addNode, updateNode } = useMindMapStore();
  const { fitView } = useViewStore();
  const { toast } = useToast();
  const { generateNodes } = useNodeGenerator();
  const menuRef = useRef<HTMLDivElement>(null);

  const [isHoveringSparkleButton, setIsHoveringSparkleButton] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);

  useEffect(() => {
    const shouldShowMenu = isHoveringSparkleButton || isHoveringMenu;

    if (shouldShowMenu && !showMenu) {
      setShowMenu(true);
    } else if (!shouldShowMenu && showMenu) {
      hideTimeout.current = setTimeout(() => {
        setShowMenu(false);
      }, 300);
    }

    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [isHoveringSparkleButton, isHoveringMenu]);

  const handleGenerate = async (mode: 'quick' | 'detailed' | 'why' | 'how') => {
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

  const handleAddNode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentNode = nodes.find(n => n.id === nodeId);
    if (currentNode) {
      const newPosition = calculateNewNodePosition(currentNode, nodes, edges);
      addNode(currentNode, '新しいトピック', newPosition);
      fitView();
    }
  };

  const handleCodeGenerate = (codes: { html?: string; css?: string; javascript?: string }) => {
    setGeneratedCodes(codes);
    setShowCodePreview(true);
  };

  return (
    <div 
      className="relative flex flex-col gap-1 z-50" 
      onClick={e => e.stopPropagation()}
    >
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white rounded-full"
          onClick={handleAddNode}
          onMouseDown={e => e.stopPropagation()}
          onDoubleClick={e => e.stopPropagation()}
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white rounded-full"
          onMouseEnter={() => {
            setIsHoveringSparkleButton(true);
            onMenuHover?.(true);
          }}
          onMouseLeave={() => {
            setIsHoveringSparkleButton(false);
            onMenuHover?.(false);
          }}
        >
          <Sparkles className="w-4 h-4 text-gray-600" />
        </Button>
      </div>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute left-full top-0 ml-2"
          onMouseEnter={() => {
            setIsHoveringMenu(true);
            onMenuHover?.(true);
          }}
          onMouseLeave={() => {
            setIsHoveringMenu(false);
            onMenuHover?.(false);
          }}
          onClick={e => e.stopPropagation()}
        >
          <CircularMenuButtons
            isLoading={isLoading}
            onGenerate={handleGenerate}
            isOpen={showMenu}
          />
          <div className="mt-2">
            <GenerateCodeButton
              nodeId={nodeId}
              onGenerate={handleCodeGenerate}
            />
          </div>
        </div>
      )}

      <CodePreviewModal
        isOpen={showCodePreview}
        onClose={() => setShowCodePreview(false)}
        codes={generatedCodes}
        preview={generatedCodes.html}
      />
    </div>
  );
};