import React from 'react';
import { NodeData } from '../../types/node';
import { cn } from '../../utils/cn';
import { getNodeThemeStyle } from './NodeStyles';

interface NodeWrapperProps {
  children: React.ReactNode;
  data: NodeData;
  level: number;
  theme: string;
  isHoveringNode: boolean;
  setIsHoveringNode: (value: boolean) => void;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  children,
  data,
  level,
  theme,
  isHoveringNode,
  setIsHoveringNode,
  onClick,
  onDoubleClick,
  onKeyDown,
}) => {
  return (
    <div
      className={cn(
        getNodeThemeStyle(level, theme),
        data.selected ? "ring-2 ring-primary" : "",
        data.isGenerating ? "animate-pulse scale-105" : "",
        "hover:shadow-xl transition-all duration-300 transform relative"
      )}
      onMouseEnter={() => setIsHoveringNode(true)}
      onMouseLeave={() => setIsHoveringNode(false)}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {children}
    </div>
  );
};