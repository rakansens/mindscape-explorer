import React, { useState } from 'react';
import { useFileStore } from '../../store/fileStore';
import { Button } from '../ui/button';
import { 
  FilePlus, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Pencil, 
  Trash2, 
  Check, 
  X,
  FolderOpen,
  File,
  Plus,
  MoreVertical,
  FolderPlus,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatDate } from '../../utils/dateUtils';
import { SaveConfirmDialog } from '../dialog/SaveConfirmDialog';
import { useToast } from '../../hooks/use-toast';
import { useMindMapStore } from '../../store/mindMapStore';
import { useViewStore } from '../../store/viewStore';
import { generateId } from '../../utils/idUtils';
import { sleep } from '../../utils/animationUtils';
import { MindMapFile, Folder, FileSystemItem } from '../../types/file';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { FileTreeItem } from './FileTreeItem';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { items, activeFileId, addFile, addFolder, removeItem, setActiveFile, updateItem, getChildren } = useFileStore();
  const files = items.filter(item => item.type === 'file') as MindMapFile[];
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'save' | 'new'>('save');
  const { nodes, edges, updateNodes, updateEdges } = useMindMapStore();
  const { fitView } = useViewStore();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const getMainNodeLabel = () => {
    const mainNode = nodes.find(n => n.id === '1');
    return mainNode?.data.label || '無題のマインドマップ';
  };

  const createNewFile = async (title?: string) => {
    // 一旦ノードをクリア
    updateNodes([]);
    updateEdges([]);
    await sleep(300);

    // 新しいノードを作成
    const newNode = {
      id: '1',
      type: 'custom',
      position: { x: window.innerWidth / 2 - 75, y: window.innerHeight / 3 },
      data: { 
        label: 'メインテーマ',
        isGenerating: true,
        isAppearing: true
      }
    };

    updateNodes([newNode]);
    await sleep(500);

    const finalNode = {
      ...newNode,
      data: {
        ...newNode.data,
        isGenerating: false,
        isAppearing: false
      }
    };

    updateNodes([finalNode]);

    // 新規ファイルを作成して一覧に追加
    const newFile: MindMapFile = {
      id: generateId(),
      title: title || '無題のマインドマップ',
      type: 'file',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        nodes: [finalNode],
        edges: []
      }
    };
    
    addFile(newFile);
    fitView();

    toast({
      title: "新規作成",
      description: "新しいマインドマップを作成しました",
    });
  };

  const handleNewFile = () => {
    // 新規作成時は常にタイトル入力モーダルを表示
    setDialogMode('new');
    setIsSaveDialogOpen(true);
  };

  const handleSaveDialog = (title: string) => {
    if (dialogMode === 'save') {
      // 通常の保存処理
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
      // 新規作成処理
      createNewFile(title);
    }
    setIsSaveDialogOpen(false);
  };

  const handleDialogClose = () => {
    // モーダルを閉じるだけで、新規作成は行わない
    setIsSaveDialogOpen(false);
  };

  const handleSave = () => {
    if (activeFileId) {
      // アクティブなファイルが存在する場合は直接上書き保存
      updateItem(activeFileId, {
        data: { nodes, edges },
        updatedAt: new Date()
      });
      toast({
        title: "保存完了",
        description: "マインドマップを保存しました",
      });
    } else {
      // 新規ファイルの場合は保存ダイアログを表示
      setDialogMode('save');
      setIsSaveDialogOpen(true);
    }
  };

  const handleEdit = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingTitle(title);
  };

  const handleSaveTitle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      updateItem(id, { title: editingTitle.trim() });
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(id);
    if (activeFileId === id) {
      createNewFile();
    }
  };

  const handleCreateFolder = () => {
    const newFolder: Folder = {
      id: generateId(),
      title: '新しいフォルダ',
      type: 'folder',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addFolder(newFolder);
    setEditingId(newFolder.id);
    setEditingTitle(newFolder.title);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderFileSystemItem = (item: FileSystemItem, level: number = 0) => {
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
          onToggle={() => toggleFolder(item.id)}
          onSelect={() => {
            if (isFolder) {
              toggleFolder(item.id);
            } else {
              setActiveFile(item.id);
              updateNodes((item as MindMapFile).data.nodes);
              updateEdges((item as MindMapFile).data.edges);
            }
          }}
          onEdit={(e) => handleEdit(item.id, item.title, e)}
          onSaveTitle={(e) => handleSaveTitle(item.id, e)}
          onCancelEdit={(e) => {
            e.stopPropagation();
            setEditingId(null);
          }}
          onDelete={(e) => handleDelete(item.id, e)}
          onTitleChange={(value) => setEditingTitle(value)}
        />
        {isFolder && isExpanded && children.length > 0 && (
          <div className="ml-4">
            {children.map(child => renderFileSystemItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-white dark:bg-gray-950 border-r border-border transition-all duration-300 z-40",
          isOpen ? "w-72" : "w-0"
        )}
      >
        {/* トグルボタン */}
        <div 
          className={cn(
            "absolute -right-8 top-1/2 -translate-y-1/2 transition-all duration-300",
            !isOpen && "translate-x-2"
          )}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "h-8 w-8 rounded-full p-0 border shadow-md",
              "hover:bg-accent hover:translate-x-0.5 transition-all",
              "flex items-center justify-center",
              !isOpen && "bg-background hover:bg-accent/80"
            )}
            aria-label={isOpen ? "サイドバーを閉じる" : "サイドバーを開く"}
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* サイドバーコンテンツ */}
        <div className={cn(
          "h-full flex flex-col transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}>
          <SidebarHeader
            onCreateFolder={handleCreateFolder}
            onCreateFile={handleNewFile}
          />

          {/* ファイル一覧 */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {getChildren(null).map(item => renderFileSystemItem(item))}
            </div>
          </ScrollArea>

          <SidebarFooter onSave={handleSave} />
        </div>
      </div>

      <SaveConfirmDialog
        isOpen={isSaveDialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveDialog}
        mode={dialogMode}
        defaultTitle={getMainNodeLabel()}
      />
    </>
  );
}; 