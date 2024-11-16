import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { MessageSquare } from 'lucide-react';
import { useMindMapStore } from '../../store/mindMapStore';

interface NodeContextMenuProps {
  children: React.ReactNode;
  nodeId: string;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ children, nodeId }) => {
  const store = useMindMapStore();

  const handleAddDescription = () => {
    const node = store.nodes.find(n => n.id === nodeId);
    if (node) {
      store.updateNode(nodeId, {
        ...node.data,
        detailedText: node.data.detailedText || "説明を入力してください"
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleAddDescription}>
          <MessageSquare className="mr-2 h-4 w-4" />
          説明を追加
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};