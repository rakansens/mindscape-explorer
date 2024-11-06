import React, { useState } from 'react';
import { useFileStore } from '../../store/fileStore';
import { useMindMapStore } from '../../store/mindMapStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { formatDate } from '../../utils/dateUtils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { MindMapFile } from '../../types/file';

interface FileListDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileListDialog: React.FC<FileListDialogProps> = ({ isOpen, onClose }) => {
  const { items, setActiveFile, updateItem, removeItem } = useFileStore();
  const { updateNodes, updateEdges } = useMindMapStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // ファイルタイプのアイテムのみをフィルタリング
  const files = items.filter(item => item.type === 'file') as MindMapFile[];

  const handleSelect = (id: string) => {
    const selectedFile = files.find(f => f.id === id);
    if (selectedFile) {
      setActiveFile(id);
      updateNodes(selectedFile.data.nodes);
      updateEdges(selectedFile.data.edges);
      onClose();
    }
  };

  const handleEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const handleSaveTitle = (id: string) => {
    if (editingTitle.trim()) {
      updateItem(id, { title: editingTitle.trim() });
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>マインドマップ一覧</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] mt-4">
          <div className="grid grid-cols-1 gap-2">
            {files.map(file => (
              // ... rest of the component remains the same ...
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}; 