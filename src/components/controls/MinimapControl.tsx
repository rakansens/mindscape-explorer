import React from 'react';
import { MiniMap } from 'reactflow';
import { preventEvent } from '../../utils/eventUtils';

interface MinimapControlProps {
  showMinimap: boolean;
  onToggle: () => void;
}

export const MinimapControl: React.FC<MinimapControlProps> = ({
  showMinimap,
  onToggle
}) => (
  <>
    <button
      onClick={(e) => {
        preventEvent(e);
        onToggle();
      }}
      className={`p-2 rounded-lg transition-colors ${
        showMinimap
          ? 'bg-blue-100/50 text-blue-600'
          : 'hover:bg-blue-100/50 text-blue-500'
      }`}
      title="ミニマップ表示"
      style={{ cursor: 'pointer' }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    </button>

    {showMinimap && (
      <MiniMap
        className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100"
        maskColor="rgba(0, 0, 0, 0.1)"
        nodeColor={(node) => node.data?.color || '#ffffff'}
      />
    )}
  </>
);