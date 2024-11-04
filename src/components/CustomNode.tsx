import React, { useState, useRef } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { Handle, Position } from 'reactflow';
import { Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
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
    detailedText?: string;
  };
  id: string;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [inputValue, setInputValue] = useState(data.label);
  const [showButton, setShowButton] = useState(false);
  
  const { activeMenuNodeId, setActiveMenuNodeId } = useMenuStore();
  const showGenerateMenu = activeMenuNodeId === id;

  const inputRef = useRef<HTMLInputElement>(null);
  const generateMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  let menuTimeout = useRef<NodeJS.Timeout>();
  let hideTimeout = useRef<NodeJS.Timeout>();
  
  const store = useMindMapStore();
  const level = getNodeLevel(store.edges, id);

  const handleNodeMouseEnter = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    setShowButton(true);
  };

  const handleNodeMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setShowButton(false);
      setActiveMenuNodeId(null);
    }, 300);
  };

  const handleMenuMouseEnter = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    menuTimeout.current = setTimeout(() => {
      setActiveMenuNodeId(id);
    }, 1000);
  };

  const handleMenuMouseLeave = () => {
    if (menuTimeout.current) {
      clearTimeout(menuTimeout.current);
    }
    hideTimeout.current = setTimeout(() => {
      setActiveMenuNodeId(null);
    }, 300);
  };

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

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div 
        className="relative group"
        onMouseEnter={handleNodeMouseEnter}
        onMouseLeave={handleNodeMouseLeave}
      >
        <div className={`relative min-w-[120px] max-w-[300px] rounded-xl shadow-lg transition-all duration-300 transform
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
                <div className="text-white cursor-pointer" onClick={handleClick}>
                  {data.label}
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

        <div 
          className={`absolute -right-12 top-1/2 -translate-y-1/2 transition-opacity duration-300
            ${showButton ? 'opacity-100' : 'opacity-0'}`}
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        >
          <button
            ref={buttonRef}
            className={`${nodeStyles.button} ${nodeStyles.generateButton}
              ${showGenerateMenu ? 'bg-blue-50' : ''}`}
            title="AI生成メニューを開く"
          >
            <Sparkles size={16} />
          </button>

          {showGenerateMenu && <GenerateMenu nodeId={id} />}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default CustomNode;