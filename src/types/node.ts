export interface NodeData {
  label: string;
  isEditing?: boolean;
  isGenerating?: boolean;
  isCollapsed?: boolean;
  color?: string;
  description?: string;
  selected?: boolean;
  detailedText?: string;
  isTask?: boolean;
  isCompleted?: boolean;
  isAppearing?: boolean;
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