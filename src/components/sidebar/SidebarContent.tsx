import React from 'react';
import { ScrollArea } from "../ui/scroll-area";
import { FileTree } from './FileTree';
import { FileSystemItem } from '../../types/file';

interface SidebarContentProps {
  items: FileSystemItem[];
  activeFileId: string | null;
  editingId: string | null;
  editingTitle: string;
  expandedFolders: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string, e: React.MouseEvent) => void;
  onSaveTitle: (id: string, e: React.MouseEvent) => void;
  onCancelEdit: (e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onTitleChange: (value: string) => void;
  getChildren: (parentId: string | null) => FileSystemItem[];
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  items,
  activeFileId,
  editingId,
  editingTitle,
  expandedFolders,
  onSelect,
  onToggle,
  onEdit,
  onSaveTitle,
  onCancelEdit,
  onDelete,
  onTitleChange,
  getChildren,
}) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        <FileTree
          items={getChildren(null)}
          onSelect={onSelect}
          onToggle={onToggle}
          expandedFolders={expandedFolders}
          activeFileId={activeFileId}
          editingId={editingId}
          editingTitle={editingTitle}
          onEdit={onEdit}
          onSaveTitle={onSaveTitle}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
          onTitleChange={onTitleChange}
          getChildren={getChildren}
        />
      </div>
    </ScrollArea>
  );
};