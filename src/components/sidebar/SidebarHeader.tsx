import React from 'react';
import { Button } from '../ui/button';
import { FolderOpen, FolderPlus, Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";

interface SidebarHeaderProps {
  onCreateFolder: () => void;
  onCreateFile: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  onCreateFolder,
  onCreateFile,
}) => {
  return (
    <div className="p-4 flex items-center justify-between border-b">
      <div className="flex items-center gap-2">
        <FolderOpen className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">マインドマップ</h2>
      </div>
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreateFolder}
              className="h-8 w-8"
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>新規フォルダ</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreateFile}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>新規マインドマップ</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}; 