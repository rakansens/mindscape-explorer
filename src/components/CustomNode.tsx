import React, { useState, useRef } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { Handle, Position } from 'reactflow';
import { ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { getNodeLevel, getNodeStyle } from '../utils/nodeUtils';
import { DetailedTextEditor } from './DetailedTextEditor';
import { NodeMenu } from './node/NodeMenu';

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
    isTask?: boolean;
    isCompleted?: boolean;
  };
  id: string;
  xPos?: number;
  yPos?: number;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, id, xPos, yPos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [inputValue, setInputValue] = useState(data.label);
  const [showButton, setShowButton] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
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
    }, 1000);
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

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div 
        className="relative group"
        onMouseEnter={handleNodeMouseEnter}
        onMouseLeave={handleNodeMouseLeave}
      >
        <div 
          className={`relative min-w-[120px] max-w-[300px] rounded-xl shadow-lg transition-all duration-300 transform
            ${getNodeStyle(level)}
            ${data.selected ? 'ring-2 ring-blue-500' : ''}
            ${data.isGenerating ? 'animate-pulse' : ''}
            hover:shadow-xl`}
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

        <NodeMenu 
          id={id}
          showButton={showButton}
          setShowButton={setShowButton}
        />
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default CustomNode;