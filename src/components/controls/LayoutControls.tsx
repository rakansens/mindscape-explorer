import React from 'react';
import { preventEvent } from '../../utils/eventUtils';
import { Layout } from 'lucide-react';
import { Tooltip } from '../Tooltip';

interface LayoutControlsProps {
  onAutoLayout: () => void;
}

export const LayoutControls: React.FC<LayoutControlsProps> = ({
  onAutoLayout
}) => (
  <div className="flex gap-1">
    <Tooltip text="レイアウトを自動整列" position="bottom">
      <button
        onClick={(e) => {
          preventEvent(e);
          onAutoLayout();
        }}
        className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
        title="レイアウトを自動整列"
        style={{ cursor: 'pointer' }}
      >
        <Layout className="w-5 h-5" />
      </button>
    </Tooltip>
  </div>
);