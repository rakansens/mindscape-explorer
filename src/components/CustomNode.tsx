import React, { useState, useRef, useEffect } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { Handle, Position } from 'reactflow';
import { ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { getNodeLevel, getNodeStyle } from '../utils/nodeUtils';
import { DetailedTextEditor } from './DetailedTextEditor';
import { GenerateMenu } from './GenerateMenu';
import { NodeData } from '../types/node';

interface CustomNodeProps {
  data: NodeData;
  id: string;
  xPos?: number;
  yPos?: number;
}

const LoadingAnimation = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="animate-pulse flex space-x-1">
      <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animation-delay-200"></div>
      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animation-delay-400"></div>
    </div>
  </div>
);

const CustomNode: React.FC<CustomNodeProps> = ({ data, id, xPos, yPos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [inputValue, setInputValue] = useState(data.label);
  const [showButton, setShowButton] = useState(false);
  const [isHoveringNode, setIsHoveringNode] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout>();
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  const store = useMindMapStore();
  const level = getNodeLevel(store.edges, id);

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
      data: {
        ...data,
        selected: true
      }
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
        const parentEdge = store.edges.find(edge => edge.target === id);
        const parentId = parentEdge?.source;
        if (parentId) {
          const parentNode = store.nodes.find(n => n.id === parentId);
          if (parentNode) {
            store.addNode(parentNode, 'New Node', {
              x: xPos || 0,
              y: (yPos || 0) + 100
            });
          }
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (data.selected) {
        const currentNode = store.nodes.find(n => n.id === id);
        if (currentNode) {
          store.addNode(currentNode, 'New Node', {
            x: (xPos || 0) + 250,
            y: yPos || 0
          });
        }
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
      data: {
        ...data,
        isCompleted: !data.isCompleted
      }
    });
  };

  const handleMenuHover = (isHovering: boolean) => {
    if (isHovering) {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
      setIsHoveringMenu(true);
      setShowButton(true);
      store.updateNode(id, {
        data: {
          ...data,
          selected: true
        }
      });
    } else {
      setIsHoveringMenu(false);
    }
  };

  useEffect(() => {
    const shouldShowButton = isHoveringNode || isHoveringMenu;
    
    if (!shouldShowButton) {
      hideTimeout.current = setTimeout(() => {
        if (!isHoveringNode && !isHoveringMenu) {
          setShowButton(false);
          store.updateNode(id, {
            data: {
              ...data,
              selected: false
            }
          });
        }
      }, 1000);
    } else {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
      setShowButton(true);
    }

    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [isHoveringNode, isHoveringMenu, id, data, store]);

  if (!data) {
    console.warn(`Node ${id} has no data`);
    return null;
  }

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div 
        className="relative group"
        onMouseEnter={handleNodeMouseEnter}
        onMouseLeave={handleNodeMouseLeave}
      >
        <div 
          className={`relative min-w-[120px] max-w-[300px] rounded-xl shadow-lg
            ${getNodeStyle(level)}
            ${data.selected ? 'ring-2 ring-blue-500' : ''}
            ${data.isGenerating ? 'animate-wiggle' : ''}
            ${data.isAppearing ? 'animate-in fade-in zoom-in duration-500' : ''}
            hover:shadow-xl
            transition-all duration-300 transform
          `}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
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
              {data.isTask && (
                <button
                  onClick={toggleTaskCompletion}
                  className="text-white hover:bg-white/10 rounded p-1"
                >
                  {data.isCompleted ? 
                    <CheckSquare size={16} className="text-green-300" /> : 
                    <Square size={16} />
                  }
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
                <div className={`text-white cursor-pointer ${data.isCompleted ? 'line-through opacity-70' : ''}`}>
                  {data.label}
                </div>
              )}
            </div>
            
            {data.detailedText && !isCollapsed && (
              <div className="mt-2 pt-2 border-t border-white/20 text-white/90 text-sm">
                <div className="max-h-[200px] overflow-y-auto" style={{ width: '250px' }}>
                  <DetailedTextEditor nodeId={id} initialText={data.detailedText} />
                </div>
              </div>
            )}
          </div>
        </div>

        {showButton && (
          <div
            className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full"
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
          >
            <GenerateMenu 
              nodeId={id} 
              onMenuHover={handleMenuHover}
            />
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />

      {data.isGenerating && <LoadingAnimation />}
    </>
  );
};

export default CustomNode;