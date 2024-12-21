import { CSSProperties } from 'react';

export interface NodeData {
  label: string;
  selected?: boolean;
  isGenerating?: boolean;
  isAppearing?: boolean;
  isRemoving?: boolean;
  detailedText?: string;
  isTask?: boolean;
  isCompleted?: boolean;
  isCollapsed?: boolean;
  isCode?: boolean;
  style?: CSSProperties;
}

export interface CustomNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: NodeData;
  style?: CSSProperties;
  parentNode?: string;
  extent?: 'parent' | [number, number, number, number];
}