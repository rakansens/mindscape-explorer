import React, { useState, useRef, useCallback, memo } from 'react';
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

  const handleNodeVisibility = useCallback((isVisible: boolean) => {
    if (data.selected !== isVisible) {
      store.updateNode(id, { selected: isVisible });
    }
  }, [id, store, data.selected]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const currentNode = store.nodes.find(n => n.id === id);
      if (currentNode) {
        const newPosition = calculateNewNodePosition(currentNode, store.nodes, store.edges);
        store.addNode(currentNode, '新しいトピック', newPosition);
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

        <GenerateMenu
          nodeId={id}
          onVisibilityChange={handleNodeVisibility}
        />

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