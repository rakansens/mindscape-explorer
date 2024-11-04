import React from 'react';
import { preventEvent } from '../../utils/eventUtils';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onFitView
}) => (
  <div className="flex gap-1">
    <button
      onClick={(e) => {
        preventEvent(e);
        onZoomIn();
      }}
      className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
      title="ズームイン"
      style={{ cursor: 'pointer' }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
      </svg>
    </button>
    <button
      onClick={(e) => {
        preventEvent(e);
        onZoomOut();
      }}
      className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
      title="ズームアウト"
      style={{ cursor: 'pointer' }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
      </svg>
    </button>
    <button
      onClick={(e) => {
        preventEvent(e);
        onFitView();
      }}
      className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
      title="全体表示"
      style={{ cursor: 'pointer' }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    </button>
  </div>
);