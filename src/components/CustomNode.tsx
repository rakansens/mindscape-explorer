import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
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

const CustomNode = memo(({ data, id }: CustomNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(data.label);
  const [showButton, setShowButton] = useState(false);
  const [isHoveringNode, setIsHoveringNode] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [previewCodes, setPreviewCodes] = useState<{
    html?: string;
    css?: string;
    javascript?: string;
  }>({});
  
  const inputRef = useRef<HTMLInputElement>(null);
  const store = useMindMapStore();
  const { theme } = useViewStore();
  const level = getNodeLevel(store.edges, id);

  // Memoize the node selection update
  const updateNodeSelection = useCallback((selected: boolean) => {
    if (data.selected !== selected) {
      store.updateNode(id, { selected });
    }
  }, [id, store, data.selected]);

  // Handle node visibility with debounced updates
  useEffect(() => {
    if (isHoveringNode) {
      setShowButton(true);
      updateNodeSelection(true);
    } else {
      const timer = setTimeout(() => {
        setShowButton(false);
        updateNodeSelection(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isHoveringNode, updateNodeSelection]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentNode = store.nodes.find(n => n.id === id);
      if (currentNode) {
        // Find parent node
        const parentEdge = store.edges.find(edge => edge.target === id);
        if (parentEdge) {
          const parentNode = store.nodes.find(n => n.id === parentEdge.source);
          if (parentNode) {
            // Calculate position for new sibling node
            const siblingNodes = store.nodes.filter(n => 
              store.edges.some(e => e.source === parentNode.id && e.target === n.id)
            );
            const newPosition = calculateNewNodePosition(parentNode, siblingNodes.length, store.edges);
            store.addNode(parentNode, '新しいトピック', newPosition);
          }
        }
      }
    }
  }, [id, store]);

  const handleCodePreview = useCallback(() => {
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
  }, [data.detailedText]);

  const handleNodeClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    store.selectNode(id);
  }, [id, store]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleMenuHover = useCallback((isHovering: boolean) => {
    if (isHovering) {
      setShowButton(true);
      updateNodeSelection(true);
    }
  }, [updateNodeSelection]);

  if (!data) {
    console.warn(`Node ${id} has no data`);
    return null;
  }

  return (
    <NodeContextMenu nodeId={id}>
      <div
        className={cn(
          getNodeThemeStyle(level, theme),
          data.selected ? "ring-2 ring-primary" : "",
          data.isGenerating ? "animate-pulse scale-105" : "",
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
              onMenuHover={handleMenuHover}
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
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;