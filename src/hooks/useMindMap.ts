// マインドマップの操作に関する共通ロジックを集約
import { useCallback } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { useFileStore } from '../store/fileStore';
import { useViewStore } from '../store/viewStore';

export const useMindMap = () => {
  const { nodes, edges, updateNodes, updateEdges } = useMindMapStore();
  const { activeFileId, updateItem } = useFileStore();
  const { fitView } = useViewStore();

  const saveCurrentState = useCallback(() => {
    if (activeFileId) {
      updateItem(activeFileId, {
        data: { nodes, edges },
        updatedAt: new Date()
      });
    }
  }, [activeFileId, nodes, edges]);

  return {
    nodes,
    edges,
    updateNodes,
    updateEdges,
    saveCurrentState,
    fitView
  };
}; 