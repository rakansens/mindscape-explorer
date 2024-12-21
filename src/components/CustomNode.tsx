import React, { useState, useRef, useEffect } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { useViewStore } from '../store/viewStore';
import { getNodeLevel } from '../utils/nodeUtils';
import { GenerateMenu } from './GenerateMenu';
import { NodeData } from '../types/node';
import { cn } from '../utils/cn';
import { NodeContextMenu } from './node/NodeContextMenu';
import { NodeContent } from './node/NodeContent';
import { NodePreviewButton } from './node/NodePreviewButton';
import { CodePreviewModal } from './code/CodePreviewModal';
import { getNodeThemeStyle } from './node/NodeStyles';
import { calculateNewNodePosition } from '../utils/nodePositionUtils';
import { NodeHandles } from './node/NodeHandles';

interface CustomNodeProps {
  id: string;
  data: NodeData;
  xPos: number;
  yPos: number;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, id }) => {
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
  const { theme } = useViewStore();
  const level = getNodeLevel(store.edges, id);

  useEffect(() => {
    const shouldShowButton = isHoveringNode || isHoveringMenu;
    
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    if (shouldShowButton) {
      setShowButton(true);
      store.updateNode(id, { selected: true });
    }

    hideTimeout.current = setTimeout(() => {
      if (!isHoveringNode && !isHoveringMenu) {
        setShowButton(false);
        store.updateNode(id, { selected: false });
      }
    }, 1000);

    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [isHoveringNode, isHoveringMenu]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const currentNode = store.nodes.find(n => n.id === id);
      if (currentNode) {
        const newPosition = calculateNewNodePosition(currentNode, store.nodes, store.edges);
        store.addNode(currentNode, '新しいトピック', newPosition);
      }
    }
  };

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

  const handleNodeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    store.selectNode(id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <NodeContextMenu nodeId={id}>
      <div
        className={cn(
          getNodeThemeStyle(level, theme),
          data.selected ? "ring-2 ring-primary" : "",
          data.isGenerating ? "animate-pulse scale-105" : "",
          !data.showBox ? "border-0 shadow-none bg-transparent" : "", // 修正：背景も透明に
          "hover:shadow-xl transition-all duration-300 transform relative"
        )}
        onMouseEnter={() => setIsHoveringNode(true)}
        onMouseLeave={() => setIsHoveringNode(false)}
        onClick={handleNodeClick}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <NodeHandles />
        
        <NodeContent
          id={id}
          data={data}
          isEditing={isEditing}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleEditComplete={() => {
            if (inputValue.trim() !== '') {
              store.updateNodeText(id, inputValue);
            } else {
              setInputValue(data.label);
            }
            setIsEditing(false);
          }}
          inputRef={inputRef}
        />

        {data.isCode && (
          <NodePreviewButton onClick={handleCodePreview} />
        )}

        {showButton && (
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full">
            <GenerateMenu
              nodeId={id}
              onMenuHover={(isHovering) => {
                if (isHovering) {
                  setIsHoveringMenu(true);
                } else {
                  setIsHoveringMenu(false);
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
