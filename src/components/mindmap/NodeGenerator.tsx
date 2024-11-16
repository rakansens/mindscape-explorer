import { Node } from 'reactflow';
import { HierarchyItem } from '../../types/common';
import { sleep, animateText } from '../../utils/animationUtils';
import { useMindMapStore } from '../../store/mindMapStore';

export const useNodeGenerator = () => {
  const { addNode, updateNodeText } = useMindMapStore();

  const generateNodes = async (
    parentNode: Node,
    items: HierarchyItem[],
    onComplete?: () => void
  ) => {
    // Each item is processed sequentially
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Add delay between nodes except for the first one
      if (i > 0) {
        await sleep(800);
      }

      // Create empty node
      const newNode = addNode(parentNode, '');
      
      // Visual feedback delay
      await sleep(500);
      
      // Animate text with slower typing speed
      await animateText(
        item.text,
        async (text) => {
          updateNodeText(newNode.id, text);
        },
        100
      );

      // Post-text animation delay
      await sleep(500);

      // Process child nodes if any
      if (item.children && item.children.length > 0) {
        await sleep(800);
        await generateNodes(newNode, item.children);
      }
    }

    // Execute completion callback if provided
    if (onComplete) {
      onComplete();
    }
  };

  return { generateNodes };
};