import React, { useState } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { Handle, Position } from 'reactflow';
import { ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { getNodeLevel, getNodeStyle } from '../utils/nodeUtils';
import { DetailedTextEditor } from './DetailedTextEditor';
import { NodeButtons } from './node/NodeButtons';
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

const CustomNode: React.FC<CustomNodeProps> = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [inputValue, setInputValue] = useState(data.label);
  const [showButton, setShowButton] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const store = useMindMapStore();
  const level = getNodeLevel(store.edges, id);
  const { generateSubTopics, apiKey } = useOpenAI();
  const { toast } = useToast();

  const handleNodeMouseEnter = () => {
    setShowButton(true);
  };

  const handleNodeMouseLeave = () => {
    setShowButton(false);
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

  const handleRegenerate = async () => {
    if (!apiKey) {
      toast({
        title: "エラー",
        description: "OpenAI APIキーを設定してください",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRegenerating(true);

      // 既存の子ノードを削除
      const childEdges = store.edges.filter(edge => edge.source === id);
      const childNodeIds = childEdges.map(edge => edge.target);
      
      childNodeIds.forEach(nodeId => {
        const grandChildEdges = store.edges.filter(edge => edge.source === nodeId);
        const grandChildNodeIds = grandChildEdges.map(edge => edge.target);
        
        // 孫ノードを削除
        grandChildNodeIds.forEach(id => store.removeNode(id));
        // 子ノードを削除
        store.removeNode(nodeId);
      });

      // 新しい内容を生成
      const response = await generateSubTopics(data.label, {
        mode: data.detailedText ? 'detailed' : 'quick',
        quickType: 'simple'
      });

      if (response.children) {
        for (const [index, child] of response.children.entries()) {
          const position = {
            x: store.nodes.find(n => n.id === id)?.position.x || 0 + 250,
            y: store.nodes.find(n => n.id === id)?.position.y || 0 + (index - 1) * 150
          };

          const newNode = store.addNode(
            store.nodes.find(n => n.id === id)!,
            child.label,
            position
          );

          if (child.description) {
            store.updateNode(newNode.id, {
              data: {
                ...newNode.data,
                detailedText: child.description,
                isCollapsed: true
              }
            });
          }
        }
      }

      toast({
        title: "再生成完了",
        description: "ノードの内容を更新しました",
      });
    } catch (error) {
      console.error('再生成エラー:', error);
      toast({
        title: "エラー",
        description: "ノードの再生成に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
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

        <NodeButtons
          id={id}
          showButton={showButton}
          onRegenerateClick={handleRegenerate}
          isRegenerating={isRegenerating}
        />
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default CustomNode;