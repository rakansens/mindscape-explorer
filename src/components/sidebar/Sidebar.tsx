import React, { useState } from 'react';
import { useFileStore } from '../../store/fileStore';
import { Settings2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { SaveConfirmDialog } from '../dialog/SaveConfirmDialog';
import { useToast } from '../../hooks/use-toast';
import { useMindMapStore } from '../../store/mindMapStore';
import { useViewStore } from '../../store/viewStore';
import { generateId } from '../../utils/idUtils';
import { MindMapFile } from '../../types/file';
import { SidebarHeader } from './SidebarHeader';
import { SidebarContent } from './SidebarContent';
import { SidebarFooter } from './SidebarFooter';
import { SidebarToggle } from './SidebarToggle';
import { APIKeyInputDialog } from '../api/APIKeyInputDialog';
import { useOpenAI } from '../../store/openAIStore';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'save' | 'new'>('save');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showAPIKeyInput, setShowAPIKeyInput] = useState(false);

  const { items, activeFileId, addFile, addFolder, removeItem, setActiveFile, updateItem, getChildren } = useFileStore();
  const { nodes, edges, updateNodes, updateEdges } = useMindMapStore();
  const { fitView } = useViewStore();
  const { toast } = useToast();
  const { apiKey, setApiKey } = useOpenAI();

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
      createNewFile(title);
    }
    setIsSaveDialogOpen(false);
  };

  const handleDialogClose = () => {
    setIsSaveDialogOpen(false);
  };

  const handleSave = () => {
    if (activeFileId) {
      updateItem(activeFileId, {
        data: { nodes, edges },
        updatedAt: new Date()
      });
      toast({
        title: "保存完了",
        description: "マインドマップを保存しました",
      });
    } else {
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
    const newFolder = {
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

  return (
    <>
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-white dark:bg-gray-950 border-r border-border transition-all duration-300 z-40",
          isOpen ? "w-72" : "w-0"
        )}
      >
        <SidebarToggle isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

        <div className={cn(
          "h-full flex flex-col transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}>
          <SidebarHeader
            onCreateFolder={handleCreateFolder}
            onCreateFile={() => {
              setDialogMode('new');
              setIsSaveDialogOpen(true);
            }}
          />

          {/* Settings Button */}
          {!apiKey && (
            <Button
              onClick={() => setShowAPIKeyInput(true)}
              className="mx-4 mt-2 mb-4 flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              <Settings2 className="w-4 h-4" />
              <span>APIキーを設定</span>
            </Button>
          )}

          <SidebarContent
            items={items}
            activeFileId={activeFileId}
            editingId={editingId}
            editingTitle={editingTitle}
            expandedFolders={expandedFolders}
            onSelect={setActiveFile}
            onToggle={toggleFolder}
            onEdit={handleEdit}
            onSaveTitle={handleSaveTitle}
            onCancelEdit={(e) => {
              e.stopPropagation();
              setEditingId(null);
            }}
            onDelete={handleDelete}
            onTitleChange={(value) => setEditingTitle(value)}
            getChildren={getChildren}
          />

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

      {showAPIKeyInput && (
        <APIKeyInputDialog
          onSubmit={(apiKey) => {
            setApiKey(apiKey);
            setShowAPIKeyInput(false);
            toast({
              title: "設定完了",
              description: "APIキーを設定しました",
            });
          }}
          onClose={() => setShowAPIKeyInput(false)}
        />
      )}
    </>
  );
};
