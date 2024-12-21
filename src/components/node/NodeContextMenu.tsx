import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { MessageSquare, Square, SquareOff } from 'lucide-react';
import { useMindMapStore } from '../../store/mindMapStore';

interface NodeContextMenuProps {
  children: React.ReactNode;
  nodeId: string;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ children, nodeId }) => {
  const store = useMindMapStore();
  const nodes = store.nodes;
  const showBox = nodes.some(node => node.data.showBox !== false); // デフォルトはtrue

  const handleAddDescription = () => {
    const node = store.nodes.find(n => n.id === nodeId);
    if (node) {
      store.updateNode(nodeId, {
        ...node.data,
        detailedText: node.data.detailedText || "説明を入力してください"
      });
    }
  };

  const handleToggleBox = () => {
    // すべてのノードのボックス表示を切り替え
    const newShowBox = !showBox;
    store.nodes.forEach(node => {
      store.updateNode(node.id, {
        ...node.data,
        showBox: newShowBox
      });
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleAddDescription}>
          <MessageSquare className="mr-2 h-4 w-4" />
          説明を追加
        </ContextMenuItem>
        <ContextMenuItem onClick={handleToggleBox}>
          {showBox ? (
            <>
              <SquareOff className="mr-2 h-4 w-4" />
              ボックスを非表示
            </>
          ) : (
            <>
              <Square className="mr-2 h-4 w-4" />
              ボックスを表示
            </>
          )}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};