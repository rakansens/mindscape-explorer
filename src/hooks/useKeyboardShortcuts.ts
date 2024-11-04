import { useCallback, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { useMindMapStore } from '../store/mindMapStore';

export function useKeyboardShortcuts() {
  const { 
    addNode, 
    nodes, 
    undo,
    exitEditMode 
  } = useMindMapStore();
  const { fitView } = useReactFlow();

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        const selectedNode = nodes.find((node) => node.selected);
        if (selectedNode) {
          addNode(selectedNode, 'New Topic');
        }
      } else if (event.key === 'f' && event.ctrlKey) {
        event.preventDefault();
        fitView();
      }
    },
    [nodes, addNode, fitView]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      
      // Escape key to exit edit mode
      if (e.key === 'Escape') {
        exitEditMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, exitEditMode]);
}