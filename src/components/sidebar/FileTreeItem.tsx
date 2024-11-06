import React from 'react';
import { Button } from '../ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  File, 
  FolderOpen, 
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { FileSystemItem, MindMapFile } from '../../types/file';
import { formatDate } from '../../utils/dateUtils';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface FileTreeItemProps {
  item: FileSystemItem;
  level: number;
  isExpanded: boolean;
  isActive: boolean;
  isEditing: boolean;
  editingTitle: string;
  onToggle: () => void;
  onSelect: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onSaveTitle: (e: React.MouseEvent) => void;
  onCancelEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onTitleChange: (value: string) => void;
}

export const FileTreeItem: React.FC<FileTreeItemProps> = ({
  item,
  level,
  isExpanded,
  isActive,
  isEditing,
  editingTitle,
  onToggle,
  onSelect,
  onEdit,
  onSaveTitle,
  onCancelEdit,
  onDelete,
  onTitleChange,
}) => {
  const isFolder = item.type === 'folder';
  const paddingLeft = level * 12 + 8;

  return (
    <div
      className={cn(
        "group flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent",
        isActive && "bg-accent"
      )}
      style={{ paddingLeft: `${paddingLeft}px` }}
      onClick={onSelect}
    >
      {isFolder && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      )}
      {isFolder ? (
        <FolderOpen className="h-4 w-4 text-muted-foreground" />
      ) : (
        <File className="h-4 w-4 text-muted-foreground" />
      )}
      <span className="text-sm flex-1 truncate">{item.title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={e => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            名前を変更
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}; 