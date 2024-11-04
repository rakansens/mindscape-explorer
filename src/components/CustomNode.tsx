import React, { useState, useRef } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { Handle, Position } from 'reactflow';
import { getNodeLevel, getNodeStyle } from '../utils/nodeUtils';
import { NodeButtons } from './node/NodeButtons';
import { DetailedTextEditor } from './DetailedTextEditor';
import { useOpenAI } from '../utils/openai';
import { useToast } from '../hooks/use-toast';

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
  const { generateSubTopics } = useOpenAI();
  const { toast } = useToast();

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

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await generateSubTopics(data.label, {
        mode: data.isTask ? 'how' : 'detailed'
      });
      
      if (response.children && response.children.length > 0) {
        // 既存の子ノードを削除
        const childEdges = store.edges.filter(edge => edge.source === id);
        const childNodeIds = childEdges.map(edge => edge.target);
        childNodeIds.forEach(nodeId => {
          const edges = store.edges.filter(edge => 
            edge.source === nodeId || edge.target === nodeId
          );
          edges.forEach(edge => store.onEdgesChange([{ 
            type: 'remove', 
            id: edge.id 
          }]));
          store.onNodesChange([{ type: 'remove', id: nodeId }]);
        });

        // 新しい子ノードを生成
        const baseYOffset = -150 * (response.children.length - 1) / 2;
        response.children.forEach((child, index) => {
          const currentNode = store.nodes.find(n => n.id === id);
          if (currentNode) {
            const newNode = store.addNode(currentNode, child.label, {
              x: currentNode.position.x + 250,
              y: currentNode.position.y + baseYOffset + index * 150
            });

            if (child.description) {
              store.updateNode(newNode.id, {
                ...newNode,
                data: {
                  ...newNode.data,
                  detailedText: child.description,
                  isCollapsed: true,
                  isTask: data.isTask,
                  isCompleted: false
                }
              });
            }
          }
        });

        toast({
          title: "再生成完了",
          description: `${response.children.length}個のノードを再生成しました`,
        });
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "ノードの再生成に失敗しました",
        variant: "destructive",
      });
    }
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
            hover:shadow-xl`}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="p-4">
            <div className="flex items-center gap-2">
              <NodeButtons
                nodeId={id}
                showButton={showButton}
                isCollapsed={isCollapsed}
                isTask={data.isTask}
                isCompleted={data.isCompleted}
                hasDetailedText={!!data.detailedText}
                onToggleCollapse={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(!isCollapsed);
                }}
                onToggleTaskCompletion={(e) => {
                  e.stopPropagation();
                  store.updateNode(id, {
                    data: {
                      ...data,
                      isCompleted: !data.isCompleted
                    }
                  });
                }}
                onRegenerate={handleRegenerate}
              />
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
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default CustomNode;