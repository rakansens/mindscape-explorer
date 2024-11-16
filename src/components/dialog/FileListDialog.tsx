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
              <div
                key={file.id}
                onClick={() => handleSelect(file.id)}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer"
              >
                <div className="flex-1">
                  {editingId === file.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveTitle(file.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{file.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(file.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
                {editingId !== file.id && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(file.id, file.title);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => handleDelete(file.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};