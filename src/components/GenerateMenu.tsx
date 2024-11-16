import React, { useState, useRef, useEffect } from 'react';
import { useOpenAI } from '../utils/openai';
import { useMindMapStore } from '../store/mindMapStore';
import { useViewStore } from '../store/viewStore';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { GenerateMenuButtons } from './generate/GenerateMenuButtons';
import { GenerateCodeButton } from './code/GenerateCodeButton';
import { CodePreviewModal } from './code/CodePreviewModal';
import { useNodeGenerator } from '../components/mindmap/NodeGenerator';
import { parseTopicTree } from '../utils/parseUtils';

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
  const { nodes, edges, addNode, updateNode, removeChildNodes } = useMindMapStore();
  const { fitView } = useViewStore();
  const { toast } = useToast();
  const { generateNodes } = useNodeGenerator();

  const [isHoveringSparkleButton, setIsHoveringSparkleButton] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);

  useEffect(() => {
    const shouldShowMenu = isHoveringSparkleButton || isHoveringMenu;

    if (shouldShowMenu && !showMenu) {
      setShowMenu(true);
    } else if (!shouldShowMenu && showMenu) {
      hideTimeout.current = setTimeout(() => {
        setShowMenu(false);
      }, 1000);
    }

    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [isHoveringSparkleButton, isHoveringMenu]);

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
      
      // レスポンスを階層構造に変換
      const hierarchyItems = parseTopicTree(response);
      
      // 生成が完了したら元のラベルを復元
      updateNode(nodeId, {
        label: currentNode.data.label,
        isGenerating: false
      });

      // 新しいノードを生成
      await generateNodes(currentNode, hierarchyItems, () => {
        fitView({
          duration: 500,
          padding: 0.5
        });
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
      
      // エラー時は元のラベルを復元
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

  const handleAddNode = () => {
    const currentNode = nodes.find(n => n.id === nodeId);
    if (currentNode) {
      const newPosition = {
        x: currentNode.position.x + 250,
        y: currentNode.position.y
      };
      addNode(currentNode, '新しいトピック', newPosition);
      fitView();
    }
  };

  const handleCodeGenerate = (codes: { html?: string; css?: string; javascript?: string }) => {
    setGeneratedCodes(codes);
    setShowCodePreview(true);
  };

  return (
    <div className="relative flex flex-col gap-1 z-50">
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white"
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
          className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+0.25rem)] bg-white rounded-lg shadow-lg p-2 min-w-[120px] z-[60]"
          onMouseEnter={() => {
            setIsHoveringMenu(true);
            onMenuHover?.(true);
          }}
          onMouseLeave={() => {
            setIsHoveringMenu(false);
            onMenuHover?.(false);
          }}
        >
          <div className="flex flex-col gap-2">
            <GenerateMenuButtons
              isLoading={isLoading}
              onGenerate={handleGenerate}
              onAddNode={handleAddNode}
            />
            <div className="w-full h-px bg-gray-200" />
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