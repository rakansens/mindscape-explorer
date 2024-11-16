import React from 'react';
import { useFileStore } from '../../store/fileStore';
import { useMindMapStore } from '../../store/mindMapStore';
import { useToast } from '../../hooks/use-toast';
import { MindMapFile } from '../../types/file';
import { generateId } from '../../utils/idUtils';

interface FileButtonsProps {
  dialogMode: 'save' | 'new';
  setIsSaveDialogOpen: (open: boolean) => void;
  createNewFile: () => void;
}

export const FileButtons: React.FC<FileButtonsProps> = ({
  dialogMode,
  setIsSaveDialogOpen,
  createNewFile,
}) => {
  const { addFile } = useFileStore();
  const { nodes, edges } = useMindMapStore();
  const { toast } = useToast();

  const handleSaveDialog = (title: string) => {
    if (dialogMode === 'save') {
      const newFile: MindMapFile = {
        id: generateId(),
        title,
        type: 'file',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: { nodes, edges }
      };
      
      addFile(newFile);
      
      toast({
        title: "保存完了",
        description: "マインドマップを保存しました",
      });
    } else {
      createNewFile();
    }
    setIsSaveDialogOpen(false);
  };

  return null; // Component implementation will be added later
};