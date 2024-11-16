import React from 'react';
import { preventEvent } from '../../utils/eventUtils';
import { Layout } from 'lucide-react';
import { Tooltip } from '../Tooltip';
import { useMindMapStore } from '../../store/mindMapStore';
import { calculateElkLayout } from '../../utils/elkLayout';

export const LayoutControls: React.FC = () => {
  const { nodes, edges, updateNodes, updateEdges } = useMindMapStore();

  const handleAutoLayout = async () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = await calculateElkLayout(nodes, edges);
    updateNodes(layoutedNodes);
    updateEdges(layoutedEdges);
  };

  return (
    <div className="flex gap-1">
      <Tooltip text="レイアウトを自動整列" position="bottom">
        <button
          onClick={(e) => {
            preventEvent(e);
            handleAutoLayout();
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
};