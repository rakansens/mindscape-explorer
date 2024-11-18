import { useEffect } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { useFileStore } from '../store/fileStore';
import { Node } from 'reactflow';
import { NodeData } from '../types/node';

export const useKeyboardShortcuts = () => {
  const { nodes, edges, selectNode, updateNodes } = useMindMapStore();
  const { activeFileId } = useFileStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + A: Select all nodes
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        const updatedNodes = nodes.map(node => ({
          ...node,
          data: { ...node.data, selected: true }
        }));
        updateNodes(updatedNodes);
        return;
      }

      // Arrow keys: Navigate between nodes
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        
        // Find currently selected node
        const selectedNode = nodes.find(node => node.data.selected);
        if (!selectedNode) {
          // If no node is selected, select the first node
          if (nodes.length > 0) {
            selectNode(nodes[0].id);
          }
          return;
        }

        // Get connected nodes through edges
        const connectedNodes = edges
          .filter(edge => edge.source === selectedNode.id || edge.target === selectedNode.id)
          .map(edge => {
            const connectedId = edge.source === selectedNode.id ? edge.target : edge.source;
            return nodes.find(node => node.id === connectedId);
          })
          .filter((node): node is Node<NodeData> => node !== undefined);

        if (connectedNodes.length === 0) return;

        let nextNode: Node<NodeData> | undefined;

        switch (e.key) {
          case 'ArrowUp': {
            nextNode = connectedNodes.reduce((closest, current) => {
              if (current.position.y >= selectedNode.position.y) return closest;
              if (!closest || current.position.y > closest.position.y) return current;
              return closest;
            }, undefined as Node<NodeData> | undefined);
            break;
          }
          case 'ArrowDown': {
            nextNode = connectedNodes.reduce((closest, current) => {
              if (current.position.y <= selectedNode.position.y) return closest;
              if (!closest || current.position.y < closest.position.y) return current;
              return closest;
            }, undefined as Node<NodeData> | undefined);
            break;
          }
          case 'ArrowLeft': {
            nextNode = connectedNodes.reduce((closest, current) => {
              if (current.position.x >= selectedNode.position.x) return closest;
              if (!closest || current.position.x > closest.position.x) return current;
              return closest;
            }, undefined as Node<NodeData> | undefined);
            break;
          }
          case 'ArrowRight': {
            nextNode = connectedNodes.reduce((closest, current) => {
              if (current.position.x <= selectedNode.position.x) return closest;
              if (!closest || current.position.x < closest.position.x) return current;
              return closest;
            }, undefined as Node<NodeData> | undefined);
            break;
          }
        }

        if (nextNode) {
          // Update selection without moving nodes
          selectNode(nextNode.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, selectNode, updateNodes]);
};