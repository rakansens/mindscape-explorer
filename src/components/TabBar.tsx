import React from 'react';
import { useFileStore } from '../store/fileStore';
import { MindMapFile } from '../types/file';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { generateId } from '../utils/idUtils';

export const TabBar = () => {
  const { items, activeFileId, addFile, removeItem, setActiveFile } = useFileStore();
  // itemsからファイルのみをフィルタリング
  const files = items.filter(item => item.type === 'file') as MindMapFile[];

  const handleNewFile = () => {
    const newFile: MindMapFile = {
      id: generateId(),
      title: '無題のマインドマップ',
      type: 'file',  // 追加
      parentId: null,  // 追加
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        nodes: [
          {
            id: '1',
            type: 'custom',
            position: { x: 0, y: 0 },
            data: { label: '新しいマインドマップ' }
          }
        ],
        edges: []
      }
    };
    addFile(newFile);
  };

  return (
    <div className="flex items-center gap-1 px-2 h-10 bg-white/80 backdrop-blur-sm border-b">
      {files.map(file => (
        <div
          key={file.id}
          className={`
            group flex items-center gap-2 px-3 py-1.5 rounded-t-lg
            cursor-pointer transition-colors
            ${file.id === activeFileId 
              ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
              : 'hover:bg-gray-100/50'}
          `}
          onClick={() => setActiveFile(file.id)}
        >
          <span className="text-sm truncate max-w-[200px]">
            {file.title}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="w-4 h-4 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              removeItem(file.id);  // removeFileをremoveItemに変更
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={handleNewFile}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}; 