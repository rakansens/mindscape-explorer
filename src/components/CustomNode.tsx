import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { useMindMapStore } from '../store/mindMapStore';
import { useViewStore } from '../store/viewStore';
import { getNodeLevel, getNodeStyle } from '../utils/nodeUtils';
import { getNodeAnimationClass } from '../utils/animationUtils';
import { LoadingAnimation } from './animations/LoadingAnimation';
import { TypingAnimation } from './animations/TypingAnimation';
import { DetailedTextEditor } from './DetailedTextEditor';
import { GenerateMenu } from './GenerateMenu';
import { NodeData } from '../types/node';
import { cn } from '../utils/cn';

interface CustomNodeProps {
  id: string;
  data: NodeData;
  xPos: number;
  yPos: number;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, id, xPos, yPos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState(data.label);
  const [showButton, setShowButton] = useState(false);
  const [isHoveringNode, setIsHoveringNode] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const store = useMindMapStore();
  const { 
    animatingNodes, 
    loadingNodes,
    setNodeAnimating,
    setNodeLoading
  } = useViewStore();
  
  const level = getNodeLevel(store.edges, id);
  const isAnimating = animatingNodes.has(id);
  const isLoading = loadingNodes.has(id);

  // アニメーション状態の監視と制御
  useEffect(() => {
    if (data.isAppearing) {
      setNodeAnimating(id, true);
    } else {
      setNodeAnimating(id, false);
    }
  }, [data.isAppearing, id, setNodeAnimating]);

  useEffect(() => {
    if (data.isGenerating) {
      setNodeLoading(id, true);
    } else {
      setNodeLoading(id, false);
    }
  }, [data.isGenerating, id, setNodeLoading]);

  const handleMenuMouseEnter = () => {
    setIsHoveringMenu(true);
  };

  const handleMenuMouseLeave = () => {
    setIsHoveringMenu(false);
  };

  const handleNodeMouseEnter = () => {
    setIsHoveringNode(true);
    setShowButton(true);
    store.updateNode(id, {
      selected: true
    });
  };

  const handleNodeMouseLeave = () => {
    setIsHoveringNode(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    store.selectNode(id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() !== '') {
        store.updateNodeText(id, inputValue);
        setIsEditing(false);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentNode = store.nodes.find(n => n.id === id);
      if (currentNode) {
        const siblings = store.edges
          .filter(edge => edge.source === currentNode.id)
          .map(edge => store.nodes.find(n => n.id === edge.target))
          .filter(Boolean);

        const newPosition = {
          x: currentNode.position.x + 250,
          y: siblings.length > 0
            ? siblings[siblings.length - 1]!.position.y + 100
            : currentNode.position.y
        };

        store.addNode(currentNode, '新しいトピック', newPosition);
        store.fitView();
      }
    } else if (e.key === 'Escape') {
      setInputValue(data.label);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim() !== '') {
      store.updateNodeText(id, inputValue);
    } else {
      setInputValue(data.label);
    }
    setIsEditing(false);
  };

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  const toggleTaskCompletion = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.updateNode(id, {
      isCompleted: !data.isCompleted
    });
  };

  const handleMenuHover = (isHovering: boolean) => {
    if (isHovering) {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
      setIsHoveringMenu(true);
      setShowButton(true);
    } else {
      setIsHoveringMenu(false);
    }
  };

  useEffect(() => {
    const shouldShowButton = isHoveringNode || isHoveringMenu;
    
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    if (shouldShowButton) {
      setShowButton(true);
      store.updateNode(id, {
        selected: true
      });
    }

    hideTimeout.current = setTimeout(() => {
      if (!isHoveringNode && !isHoveringMenu) {
        setShowButton(false);
        store.updateNode(id, {
          selected: false
        });
      }
    }, 1000);

    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [isHoveringNode, isHoveringMenu]);

  const renderLabel = () => {
    if (isLoading) {
      return <LoadingAnimation />;
    }
    if (data.isAppearing && data.label) {
      return (
        <TypingAnimation 
          text={data.label} 
          onComplete={() => {
            store.updateNode(id, { isAppearing: false });
            setNodeAnimating(id, false);
          }} 
        />
      );
    }
    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleEditComplete}
          className="bg-transparent text-white outline-none w-full"
          autoFocus
        />
      );
    }
    return <span className="text-white">{data.label}</span>;
  };

  // ノードの編集状態を管理
  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    // 次のフレームでフォーカスを設定
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  // 編集完了時の処理
  const handleEditComplete = () => {
    if (inputValue.trim() !== '') {
      store.updateNode(id, {
        label: inputValue.trim()
      });
    } else {
      setInputValue(data.label);
    }
    setIsEditing(false);
  };

  if (!data) {
    console.warn(`Node ${id} has no data`);
    return null;
  }

  return (
    <div
      className={cn(
        "relative min-w-[120px] max-w-[300px] rounded-xl shadow-lg",
        getNodeStyle(level, data.isAppearing, data.isRemoving),
        data.selected ? "ring-2 ring-blue-500" : "",
        data.isGenerating ? "animate-pulse scale-105" : "",
        "hover:shadow-xl transition-all duration-300 transform"
      )}
      onMouseEnter={handleNodeMouseEnter}
      onMouseLeave={handleNodeMouseLeave}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-blue-500/50" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-blue-500/50" />
      
      <div className="p-4">
        <div className="flex items-center gap-2">
          {data.detailedText && (
            <button
              onClick={toggleCollapse}
              className="text-white hover:bg-white/10 rounded p-1"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
          {data.isTask && (
            <button
              onClick={toggleTaskCompletion}
              className="text-white hover:bg-white/10 rounded p-1"
            >
              {data.isCompleted ? (
                <CheckSquare className="w-4 h-4 text-green-300" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
          )}
          
          {renderLabel()}
        </div>

        {data.detailedText && !isCollapsed && (
          <div className="mt-2 pt-2 border-t border-white/20">
            <div className="max-h-[200px] overflow-y-auto" style={{ width: '250px' }}>
              <DetailedTextEditor 
                nodeId={id} 
                initialText={data.detailedText}
              />
            </div>
          </div>
        )}
      </div>

      {showButton && (
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full">
          <GenerateMenu
            nodeId={id}
            onMenuHover={handleMenuHover}
          />
        </div>
      )}
    </div>
  );
};

export default CustomNode;