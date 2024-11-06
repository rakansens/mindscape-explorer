import { Node, Edge } from './reactflow';

export type FileType = 'file' | 'folder';

export interface BaseItem {
  id: string;
  title: string;
  type: FileType;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MindMapFile extends BaseItem {
  type: 'file';
  data: {
    nodes: Node[];
    edges: Edge[];
  };
}

export interface Folder extends BaseItem {
  type: 'folder';
}

export type FileSystemItem = MindMapFile | Folder; 