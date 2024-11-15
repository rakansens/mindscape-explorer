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
import { parseTopicTree } from '../utils/parseUtils';
import { animateText } from '../utils/animationUtils';

interface GenerateMenuProps {
  nodeId: string;
  onMenuHover?: (isHovering: boolean) => void;
}

// ノードの配置に関する定数
const SPACING = {
  HORIZONTAL: 250,  // 親ノードからの水平距離
  VERTICAL: 100    // ノード間の垂直距離
};

export const GenerateMenu: React.FC<GenerateMenuProps> = ({ nodeId, onMenuHover }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const { generateSubTopics } = useOpenAI();
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

  // 新しいノードの位置を計算する関数
  const calculateNewNodePosition = (parentNode: any, childCount: number) => {
    // 親ノードの子ノードの数を取得
    const siblings = edges.filter(edge => edge.source === parentNode.id);
    
    // 基本位置（親ノードの右側）
    const baseX = parentNode.position.x + SPACING.HORIZONTAL;
    
    // 垂直位置を計算（既存の子ノードの数に基づいて）
    let baseY = parentNode.position.y;
    
    // 子ノードが存在する場合、最後の子ノードの下に配置
    if (siblings.length > 0) {
      const lastSibling = nodes.find(n => n.id === siblings[siblings.length - 1].target);
      if (lastSibling) {
        baseY = lastSibling.position.y + SPACING.VERTICAL;
      }
    }

    return { x: baseX, y: baseY };
  };

  const handleGenerate = async (mode: 'quick' | 'detailed' | 'why' | 'how' | 'regenerate' | 'ideas') => {
    try {
      setIsLoading(true);
      const currentNode = nodes.find(n => n.id === nodeId);
      if (!currentNode) return;

      updateNode(nodeId, {
        isGenerating: true,
        label: '生成中...'
      });

      let addedNodes = 0;

      if (mode === 'regenerate') {
        removeChildNodes(nodeId);
        await sleep(500);
      }

      const response = await generateSubTopics(currentNode.data.label, { mode });
      const hierarchy = parseTopicTree(response);

      // メインノードを元に戻す
      updateNode(nodeId, {
        label: currentNode.data.label,
        isGenerating: false
      });

      for (const item of hierarchy) {
        try {
          // 新しいノードの位置を計算
          const position = calculateNewNodePosition(currentNode, addedNodes);

          // 新しいノードを空のラベルで作成
          const newNode = addNode(currentNode, '', position);

          // アニメーション用のフラグを設定
          updateNode(newNode.id, {
            label: '',  // 空文字列から開始
            isAppearing: true  // このフラグがTypingAnimationをトリガー
          });

          await sleep(300);

          // テキストを直接設定せず、TypingAnimationに任せる
          updateNode(newNode.id, {
            label: item.text,  // 最終的なテキスト
            isAppearing: true  // アニメーション中はtrueを維持
          });

          await sleep(item.text.length * 50 + 500); // テキストの長さに応じて待機

          // アニメーション完了後の状態設定
          updateNode(newNode.id, {
            label: item.text,
            detailedText: item.description,
            isTask: item.isTask,
            isAppearing: false
          });

          addedNodes++;
        } catch (error) {
          console.error('Failed to add node:', error);
        }
      }

      await sleep(500);
      fitView();

      toast({
        title: mode === 'regenerate' ? "再生成完了" : "生成完了",
        description: `${addedNodes}個のノードを生成しました`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "ノードの生成に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      const finalNode = nodes.find(n => n.id === nodeId);
      if (finalNode) {
        updateNode(nodeId, {
          isGenerating: false,
          label: finalNode.data.label
        });
      }
    }
  };

  const handleAddNode = (e: React.MouseEvent) => {
    // イベントの伝播を停止
    e.preventDefault();
    e.stopPropagation();
    
    const currentNode = nodes.find(n => n.id === nodeId);
    if (currentNode) {
      // 新しいノードの位置を計算
      const childCount = edges.filter(edge => edge.source === currentNode.id).length;
      const position = calculateNewNodePosition(currentNode, childCount);
      
      // 新しいノードを追加
      addNode(currentNode, '新しいトピック', position);
      fitView();
    }
  };

  return (
    <div 
      className="relative flex flex-col gap-1 z-50"
      onClick={(e) => e.stopPropagation()} // メニュー全体でのクリックイベントの伝播を停止
    >
      {/* ボタンのコンテナ */}
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white flex items-center justify-center"
          onClick={handleAddNode}
          onMouseDown={(e) => e.stopPropagation()} // マウスダウンイベントの伝播も停止
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white flex items-center justify-center"
          onMouseEnter={handleMouseEnterSparkleButton}
          onMouseLeave={handleMouseLeaveSparkleButton}
          onClick={(e) => e.stopPropagation()} // クリックイベントの伝播を停止
        >
          <Sparkles className="w-4 h-4 text-gray-600" />
        </Button>
      </div>

      {/* メニュー */}
      {showMenu && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+0.25rem)] bg-white rounded-lg shadow-lg p-2 min-w-[120px] z-[60]"
          onMouseEnter={handleMouseEnterMenu}
          onMouseLeave={handleMouseLeaveMenu}
          onClick={(e) => e.stopPropagation()} // メニュー内でのクリックイベントの伝播を停止
        >
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0 flex items-center justify-center hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                handleGenerate('quick');
              }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <Zap className="h-4 w-4 text-gray-600" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0 flex items-center justify-center hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                handleGenerate('detailed');
              }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <BookOpen className="h-4 w-4 text-gray-600" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0 flex items-center justify-center hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                handleGenerate('why');
              }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <HelpCircle className="h-4 w-4 text-gray-600" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0 flex items-center justify-center hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                handleGenerate('how');
              }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <ListTodo className="h-4 w-4 text-gray-600" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0 flex items-center justify-center hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                handleGenerate('ideas');
              }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <Lightbulb className="h-4 w-4 text-gray-600" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0 flex items-center justify-center hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                handleGenerate('regenerate');
              }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <RefreshCw className="h-4 w-4 text-gray-600" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
