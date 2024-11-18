import { useCallback, useEffect } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { useFileStore } from '../store/fileStore';
import { useLayoutStore } from '../store/layoutStore';
import { calculateNewNodePosition } from '../utils/nodePositionUtils';
import { useToast } from './use-toast';

export const useKeyboardShortcuts = () => {
  const { 
    nodes, 
    edges, 
    addNode, 
    removeChildNodes,
    updateNodeText,
    selectNode,
    selectedNodeId,
    undo,
    redo 
  } = useMindMapStore();
  const { saveCurrentFile, openFile } = useFileStore();
  const { applyLayout } = useLayoutStore();
  const { toast } = useToast();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 編集中はショートカットを無効化
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
      return;
    }

    // Ctrl/Cmd + キーの組み合わせ
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          saveCurrentFile();
          toast({
            title: "保存完了",
            description: "マインドマップを保存しました",
          });
          break;
        case 'o':
          e.preventDefault();
          openFile();
          break;
        case 'z':
          e.preventDefault();
          undo();
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
        case 'a':
          e.preventDefault();
          nodes.forEach(node => selectNode(node.id));
          break;
        case 'l':
          e.preventDefault();
          const { nodes: layoutedNodes } = applyLayout(nodes, edges, window.innerWidth, window.innerHeight);
          layoutedNodes.forEach(node => {
            updateNodeText(node.id, node.data.label);
          });
          break;
      }
      return;
    }

    // 単独キー
    if (selectedNodeId) {
      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          const currentNode = nodes.find(n => n.id === selectedNodeId);
          if (currentNode) {
            const newPosition = calculateNewNodePosition(currentNode, nodes, edges);
            addNode(currentNode, '新しいトピック', newPosition);
          }
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          removeChildNodes(selectedNodeId);
          break;
        case 'Enter':
          e.preventDefault();
          const selectedNode = document.querySelector(`[data-nodeid="${selectedNodeId}"]`);
          if (selectedNode) {
            (selectedNode as HTMLElement).dispatchEvent(
              new MouseEvent('dblclick', { bubbles: true })
            );
          }
          break;
        case 'Escape':
          e.preventDefault();
          selectNode(null);
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          const currentNodeIndex = nodes.findIndex(n => n.id === selectedNodeId);
          if (currentNodeIndex !== -1) {
            const nextIndex = e.key === 'ArrowDown' || e.key === 'ArrowRight'
              ? (currentNodeIndex + 1) % nodes.length
              : (currentNodeIndex - 1 + nodes.length) % nodes.length;
            selectNode(nodes[nextIndex].id);
          }
          break;
      }
    }
  }, [nodes, edges, selectedNodeId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};