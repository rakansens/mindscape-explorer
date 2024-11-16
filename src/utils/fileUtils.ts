import { Node } from 'reactflow';
import { generateId } from './idUtils';
import { NodeData } from '../types/node';
import { MindMapFile } from '../types/file';

export const getMainNodeLabel = (): string => {
  const mainNode = document.querySelector('.react-flow__node-custom[data-id="1"]');
  return mainNode?.textContent || '新しいマインドマップ';
};

export const createNewFile = (title?: string): MindMapFile => {
  return {
    id: generateId(),
    title: title || '新しいマインドマップ',
    type: 'file',
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    data: {
      nodes: [{
        id: '1',
        type: 'custom',
        position: { x: window.innerWidth / 2 - 75, y: window.innerHeight / 3 },
        data: { 
          label: '新しいテーマ',
          selected: false,
          isGenerating: false,
          isAppearing: false
        }
      }],
      edges: []
    }
  };
};