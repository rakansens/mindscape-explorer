// ファイル操作に関するユーティリティを集約
import { MindMapFile, FileSystemItem } from '../types/file';
import { generateId } from './idUtils';

export const createNewMindMapFile = (title: string, data: MindMapFile['data']): MindMapFile => ({
  id: generateId(),
  title,
  type: 'file',
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  data
});

export const isFile = (item: FileSystemItem): item is MindMapFile => {
  return item.type === 'file';
}; 