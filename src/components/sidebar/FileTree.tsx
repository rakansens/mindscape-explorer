import React, { memo } from 'react';
import { FileSystemItem } from '../../types/file';
import { FileTreeItem } from './FileTreeItem';

interface FileTreeProps {
  items: FileSystemItem[];
  level?: number;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  expandedFolders: Set<string>;
  activeFileId: string | null;
  editingId: string | null;
  editingTitle: string;
  onEdit: (id: string, title: string, e: React.MouseEvent) => void;
  onSaveTitle: (id: string, e: React.MouseEvent) => void;
  onCancelEdit: (e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onTitleChange: (value: string) => void;
  getChildren: (parentId: string | null) => FileSystemItem[];
}

export const FileTree = memo(({
  items,
  level = 0,
  onSelect,
  onToggle,
  expandedFolders,
  activeFileId,
  editingId,
  editingTitle,
  onEdit,
  onSaveTitle,
  onCancelEdit,
  onDelete,
  onTitleChange,
  getChildren
}: FileTreeProps) => {
  const renderItem = (item: FileSystemItem) => {
    const isFolder = item.type === 'folder';
    const isExpanded = expandedFolders.has(item.id);
    const children = getChildren(item.id);

    return (
      <div key={item.id}>
        <FileTreeItem
          item={item}
          level={level}
          isExpanded={isExpanded}
          isActive={activeFileId === item.id}
          isEditing={editingId === item.id}
          editingTitle={editingTitle}
          onToggle={() => onToggle(item.id)}
          onSelect={() => onSelect(item.id)}
          onEdit={(e) => onEdit(item.id, item.title, e)}
          onSaveTitle={(e) => onSaveTitle(item.id, e)}
          onCancelEdit={onCancelEdit}
          onDelete={(e) => onDelete(item.id, e)}
          onTitleChange={onTitleChange}
        />
        {isFolder && isExpanded && children.length > 0 && (
          <FileTree
            items={children}
            level={level + 1}
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
        )}
      </div>
    );
  };

  return <div className="space-y-1">{items.map(renderItem)}</div>;
});

FileTree.displayName = 'FileTree';