import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useMindMapStore } from '../store/mindMapStore';
import { useViewStore } from '../store/viewStore';
import { getNodeLevel, getNodeStyle } from '../utils/nodeUtils';
import { GenerateMenu } from './GenerateMenu';
import { NodeData } from '../types/node';
import { cn } from '../utils/cn';
import { NodeContextMenu } from './node/NodeContextMenu';
import { NodeContent } from './node/NodeContent';
import { Eye } from 'lucide-react';
import { CodePreviewModal } from './code/CodePreviewModal';

interface CustomNodeProps {
  id: string;
  data: NodeData;
  xPos: number;
  yPos: number;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, id, xPos, yPos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(data.label);
  const [showButton, setShowButton] = useState(false);
  const [isHoveringNode, setIsHoveringNode] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [previewCodes, setPreviewCodes] = useState<{
    html?: string;
    css?: string;
    javascript?: string;
  }>({});
  
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

  const handleEditComplete = () => {
    if (inputValue.trim() !== '') {
      store.updateNodeText(id, inputValue);
    } else {
      setInputValue(data.label);
    }
    setIsEditing(false);
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

  const handleCodePreview = () => {
    if (data.detailedText) {
      const codeLines = data.detailedText.split('\n');
      const codes: { html?: string; css?: string; javascript?: string } = {};
      let currentLanguage = '';
      
      codeLines.forEach(line => {
        if (line.startsWith('HTML:')) {
          currentLanguage = 'html';
        } else if (line.startsWith('CSS:')) {
          currentLanguage = 'css';
        } else if (line.startsWith('JavaScript:')) {
          currentLanguage = 'javascript';
        } else if (currentLanguage && line.trim()) {
          codes[currentLanguage] = (codes[currentLanguage] || '') + line + '\n';
        }
      });

      setPreviewCodes(codes);
      setShowCodePreview(true);
    }
  };

  if (!data) {
    console.warn(`Node ${id} has no data`);
    return null;
  }

  return (
    <NodeContextMenu nodeId={id}>
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
        
        <NodeContent
          id={id}
          data={data}
          isEditing={isEditing}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleEditComplete={handleEditComplete}
          inputRef={inputRef}
        />

        {data.isCode && (
          <button
            onClick={handleCodePreview}
            className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {showButton && (
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full">
            <GenerateMenu
              nodeId={id}
              onMenuHover={(isHovering) => {
                if (isHovering) {
                  handleMenuMouseEnter();
                } else {
                  handleMenuMouseLeave();
                }
              }}
            />
          </div>
        )}

        <CodePreviewModal
          isOpen={showCodePreview}
          onClose={() => setShowCodePreview(false)}
          codes={previewCodes}
          preview={previewCodes.html}
        />
      </div>
    </NodeContextMenu>
  );
};

export default CustomNode;