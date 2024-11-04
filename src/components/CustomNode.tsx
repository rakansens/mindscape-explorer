import React, { useState, useRef, useEffect } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { Handle, Position } from 'reactflow';
import { Sparkles } from 'lucide-react';
import { getNodeLevel, getNodeStyle } from '../utils/nodeUtils';
import { nodeStyles } from '../styles/commonStyles';
import { useMenuStore } from '../store/menuStore';
import { GenerateMenu } from './GenerateMenu';

interface CustomNodeProps {
  data: {
    label: string;
    isEditing?: boolean;
    isGenerating?: boolean;
    isCollapsed?: boolean;
    color?: string;
    description?: string;
    selected?: boolean;
  };
  id: string;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputValue, setInputValue] = useState(data.label);
  
  const { activeMenuNodeId, setActiveMenuNodeId } = useMenuStore();
  const showGenerateMenu = activeMenuNodeId === id;

  const inputRef = useRef<HTMLInputElement>(null);
  const generateMenuRef = useRef<HTMLDivElement>(null);
  
  const store = useMindMapStore();

  // ノードのレベルを計算
  const level = getNodeLevel(store.edges, id);

  // 基本的なハンドラー
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    store.selectNode(id);
  };

  const handleBlur = () => {
    if (inputValue.trim() !== '') {
      store.updateNodeText(id, inputValue);
    } else {
      setInputValue(data.label);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setInputValue(data.label);
      setIsEditing(false);
    }
  };

  // クリックイベントのハンドラーを追加
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        generateMenuRef.current && 
        !generateMenuRef.current.contains(event.target as Node)
      ) {
        setActiveMenuNodeId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setActiveMenuNodeId]);

  // 生成ボタンのクリックハンドラーを修正
  const handleGenerateButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuNodeId(id);
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="relative group">
        <div 
          className={`relative min-w-[120px] rounded-xl shadow-lg p-4 
            transition-all duration-300 transform
            ${getNodeStyle(level)}
            ${data.selected ? 'ring-2 ring-blue-500' : ''}
            hover:shadow-xl`}
          onClick={handleClick}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none text-white placeholder-white/70"
              autoFocus
            />
          ) : (
            <div className="text-white">
              {data.label}
            </div>
          )}
        </div>

        {/* 生成ボタン */}
        <button
          onClick={handleGenerateButtonClick}
          className={`absolute -right-12 top-1/2 -translate-y-1/2 
            ${nodeStyles.button} ${nodeStyles.generateButton}`}
          title="AI生成メニューを開く"
        >
          <Sparkles size={16} />
        </button>

        {/* 生成メニュー */}
        {showGenerateMenu && <GenerateMenu nodeId={id} />}
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default CustomNode;
