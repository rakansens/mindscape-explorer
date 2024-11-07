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
}

export interface CustomNode {
  id: string;
  type: 'custom';
  position: {
    x: number;
    y: number;
  };
  data: NodeData;
} 