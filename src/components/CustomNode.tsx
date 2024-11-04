import React, { useState, useRef, useEffect } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { Handle, Position } from 'reactflow';
import { Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { getNodeLevel, getNodeStyle } from '../utils/nodeUtils';
import { nodeStyles } from '../styles/commonStyles';
import { useMenuStore } from '../store/menuStore';
import { GenerateMenu } from './GenerateMenu';
import { useTypingAnimation } from '../hooks/useTypingAnimation';

interface CustomNodeProps {
  data: {
    label: string;
    isEditing?: boolean;
    isGenerating?: boolean;
    isCollapsed?: boolean;
    color?: string;
    description?: string;
    selected?: boolean;
    detailedText?: string;
  };
  id: string;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [inputValue, setInputValue] = useState(data.label);
  
  const { activeMenuNodeId, setActiveMenuNodeId } = useMenuStore();
  const showGenerateMenu = activeMenuNodeId === id;

  const inputRef = useRef<HTMLInputElement>(null);
  const generateMenuRef = useRef<HTMLDivElement>(null);
  
  const store = useMindMapStore();
  const level = getNodeLevel(store.edges, id);

  const { displayText, startTyping, isTyping } = useTypingAnimation(data.label, 50);

  useEffect(() => {
    startTyping();
  }, [data.label, startTyping]);

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

  const handleGenerateButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuNodeId(id);
  };

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="relative group">
        <div 
          className={`relative min-w-[120px] max-w-[300px] rounded-xl shadow-lg transition-all duration-300 transform
            ${getNodeStyle(level)}
            ${data.selected ? 'ring-2 ring-blue-500' : ''}
            hover:shadow-xl`}
        >
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
                <div 
                  className="text-white cursor-pointer overflow-hidden whitespace-nowrap" 
                  onClick={handleClick}
                >
                  <span className={`inline-block ${isTyping ? 'animate-typing' : ''}`}>
                    {isTyping ? displayText : data.label}
                  </span>
                </div>
              )}
            </div>
            
            {data.detailedText && !isCollapsed && (
              <div className="mt-2 pt-2 border-t border-white/20 text-white/90 text-sm">
                <div className="max-h-[200px] overflow-y-auto whitespace-pre-wrap break-words" style={{ width: '250px' }}>
                  {data.detailedText}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleGenerateButtonClick}
          className={`absolute -right-12 top-1/2 -translate-y-1/2 
            ${nodeStyles.button} ${nodeStyles.generateButton}`}
          title="AI生成メニューを開く"
        >
          <Sparkles size={16} />
        </button>

        {showGenerateMenu && <GenerateMenu nodeId={id} />}
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default CustomNode;