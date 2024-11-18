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

        // Get connected nodes
        const connectedEdges = edges.filter(
          edge => edge.source === selectedNode.id || edge.target === selectedNode.id
        );

        const getClosestNode = (direction: 'up' | 'down' | 'left' | 'right'): Node<NodeData> | undefined => {
          const currentX = selectedNode.position.x;
          const currentY = selectedNode.position.y;

          // Filter nodes based on direction
          const possibleNodes = nodes.filter(node => {
            if (node.id === selectedNode.id) return false;

            const dx = node.position.x - currentX;
            const dy = node.position.y - currentY;

            switch (direction) {
              case 'up':
                return dy < 0 && Math.abs(dx) < Math.abs(dy);
              case 'down':
                return dy > 0 && Math.abs(dx) < Math.abs(dy);
              case 'left':
                return dx < 0 && Math.abs(dy) < Math.abs(dx);
              case 'right':
                return dx > 0 && Math.abs(dy) < Math.abs(dx);
              default:
                return false;
            }
          });

          // Return the closest node in that direction
          return possibleNodes.reduce((closest, current) => {
            if (!closest) return current;

            const closestDist = Math.hypot(
              closest.position.x - currentX,
              closest.position.y - currentY
            );
            const currentDist = Math.hypot(
              current.position.x - currentX,
              current.position.y - currentY
            );

            return currentDist < closestDist ? current : closest;
          }, undefined as Node<NodeData> | undefined);
        };

        let nextNode: Node<NodeData> | undefined;

        switch (e.key) {
          case 'ArrowUp':
            nextNode = getClosestNode('up');
            break;
          case 'ArrowDown':
            nextNode = getClosestNode('down');
            break;
          case 'ArrowLeft':
            nextNode = getClosestNode('left');
            break;
          case 'ArrowRight':
            nextNode = getClosestNode('right');
            break;
        }

        if (nextNode) {
          selectNode(nextNode.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, selectNode, updateNodes]);
};