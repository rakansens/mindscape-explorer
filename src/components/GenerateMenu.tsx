import React, { useState, useRef, useEffect } from 'react';
import { useOpenAI } from '../utils/openai';
import { useMindMapStore } from '../store/mindMapStore';
import { useViewStore } from '../store/viewStore';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { 
  Loader2, 
  Plus,
  BookOpen, 
  HelpCircle, 
  ListTodo, 
  RefreshCw, 
  Lightbulb,
  Sparkles,
  Zap 
} from 'lucide-react';
import { getNodeProperties } from '../utils/nodeUtils';
import { sleep } from '../utils/animationUtils';

interface GenerateMenuProps {
  nodeId: string;
  onMenuHover?: (isHovering: boolean) => void;
}
export const GenerateMenu: React.FC<GenerateMenuProps> = ({ nodeId, onMenuHover }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const { generateSubTopics, apiKey } = useOpenAI();
  const { nodes, edges, addNode, updateNode, removeChildNodes } = useMindMapStore();
  const { fitView } = useViewStore();
  const { toast } = useToast();

  // ホバー状態管理
  const [isHoveringSparkleButton, setIsHoveringSparkleButton] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);

  // メニュー表示状態を監視して制御
  useEffect(() => {
    const shouldShowMenu = isHoveringSparkleButton || isHoveringMenu;
    
    if (!shouldShowMenu && showMenu) {
      // ホバーが外れた場合、1秒後に非表示
      hideTimeout.current = setTimeout(() => {
        setShowMenu(false);
      }, 1000);
    } else if (shouldShowMenu && !showMenu) {
      // ホバー時は即時表示
      setShowMenu(true);
    }

    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [isHoveringSparkleButton, isHoveringMenu]);

  // スパークルボタンにマウスが入った時のハンドラ
  const handleMouseEnterSparkleButton = () => {
    setIsHoveringSparkleButton(true);
    onMenuHover?.(true);
  };

  // スパークルボタンからマウスが離れた時のハンドラ
  const handleMouseLeaveSparkleButton = () => {
    setIsHoveringSparkleButton(false);
    onMenuHover?.(false);
  };

  // メニューにマウスが入った時のハンドラ
  const handleMouseEnterMenu = () => {
    setIsHoveringMenu(true);
    onMenuHover?.(true);
  };

  // メニューからマウスが離れた時のハンドラ
  const handleMouseLeaveMenu = () => {
    setIsHoveringMenu(false);
    onMenuHover?.(false);
  };

  const handleGenerate = async (mode: 'quick' | 'detailed' | 'why' | 'how' | 'regenerate' | 'ideas') => {
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
    // 生成中のアニメーションを開始
    updateNode(nodeId, {
      ...currentNode,
      data: { 
        ...currentNode.data, 
        isGenerating: true,
        isAppearing: true
      }
    });

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
        structure: mode === 'regenerate' ? {
          level1: childProperties.length || 3,
          level2: 2,
          level3: 1
        } : undefined
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
          
          updateNode(newNode.id, {
            ...newNode,
            data: {
              ...newNode.data,
              isAppearing: true,
              detailedText: child.description || newNode.data.detailedText,
              isTask: mode === 'how'
            }
          });

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

      await sleep(500);
      fitView();

      // 生成完了後、アニメーションを停止
      updateNode(nodeId, {
        ...currentNode,
        data: { 
          ...currentNode.data, 
          isGenerating: false,
          isAppearing: false
        }
      });

      toast({
        title: mode === 'regenerate' ? "再生成完了" : "生成完了",
        description: `${addedNodes}個のノードを生成しました`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      updateNode(nodeId, {
        ...currentNode,
        data: { 
          ...currentNode.data, 
          isGenerating: false,
          isAppearing: false
        }
      });
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "ノードの生成に失敗しました",
        variant: "destructive",
      });
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

  return (
    <div className="relative flex flex-col gap-1 z-50">
      {/* ボタンのコンテナ */}
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white"
          onClick={handleAddNode}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white"
          onMouseEnter={handleMouseEnterSparkleButton}
          onMouseLeave={handleMouseLeaveSparkleButton}
        >
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>

      {/* メニュー */}
      {showMenu && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+0.25rem)] bg-white rounded-lg shadow-lg p-2 min-w-[120px] z-[60]"
          onMouseEnter={handleMouseEnterMenu}
          onMouseLeave={handleMouseLeaveMenu}
        >
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0"
              onClick={() => handleGenerate('quick')}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0"
              onClick={() => handleGenerate('detailed')}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0"
              onClick={() => handleGenerate('why')}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <HelpCircle className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0"
              onClick={() => handleGenerate('how')}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListTodo className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0"
              onClick={() => handleGenerate('ideas')}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0"
              onClick={() => handleGenerate('regenerate')}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
