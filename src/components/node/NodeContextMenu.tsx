import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Trash2, Copy, CheckSquare, Square } from 'lucide-react';
import { useMindMapStore } from '../../store/mindMapStore';

interface NodeContextMenuProps {
  nodeId: string;
  children: React.ReactNode;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  nodeId,
  children,
}) => {
  const { removeChildNodes, updateNode } = useMindMapStore();

  const handleDelete = (e: Event) => {
    e.preventDefault();
    removeChildNodes(nodeId);
  };

  const handleToggleTask = () => {
    updateNode(nodeId, {
      isTask: true,
      isCompleted: false
    });
  };

  const handleCopy = () => {
    // コピー機能の実装は将来的な課題
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onSelect={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>削除</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleToggleTask}>
          <CheckSquare className="mr-2 h-4 w-4" />
          <span>タスクに変換</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          <span>複製</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};