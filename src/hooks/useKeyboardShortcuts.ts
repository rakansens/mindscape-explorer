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

        const getConnectedNodeInDirection = (direction: 'up' | 'down' | 'left' | 'right'): Node<NodeData> | undefined => {
          // Get all connected edges for the current node
          const connectedEdges = edges.filter(
            edge => edge.source === selectedNode.id || edge.target === selectedNode.id
          );

          // Get all connected nodes
          const connectedNodes = connectedEdges.map(edge => {
            const nodeId = edge.source === selectedNode.id ? edge.target : edge.source;
            return nodes.find(node => node.id === nodeId);
          }).filter((node): node is Node<NodeData> => node !== undefined);

          // Filter nodes based on direction relative to selected node
          const filteredNodes = connectedNodes.filter(node => {
            const dx = node.position.x - selectedNode.position.x;
            const dy = node.position.y - selectedNode.position.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            switch (direction) {
              case 'up':
                return angle < -45 && angle > -135;
              case 'down':
                return angle > 45 && angle < 135;
              case 'left':
                return angle > 135 || angle < -135;
              case 'right':
                return angle > -45 && angle < 45;
              default:
                return false;
            }
          });

          // Return the closest node in that direction
          return filteredNodes.reduce((closest, current) => {
            if (!closest) return current;

            const closestDist = Math.hypot(
              closest.position.x - selectedNode.position.x,
              closest.position.y - selectedNode.position.y
            );
            const currentDist = Math.hypot(
              current.position.x - selectedNode.position.x,
              current.position.y - selectedNode.position.y
            );

            return currentDist < closestDist ? current : closest;
          }, undefined as Node<NodeData> | undefined);
        };

        let nextNode: Node<NodeData> | undefined;

        switch (e.key) {
          case 'ArrowUp':
            nextNode = getConnectedNodeInDirection('up');
            break;
          case 'ArrowDown':
            nextNode = getConnectedNodeInDirection('down');
            break;
          case 'ArrowLeft':
            nextNode = getConnectedNodeInDirection('left');
            break;
          case 'ArrowRight':
            nextNode = getConnectedNodeInDirection('right');
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