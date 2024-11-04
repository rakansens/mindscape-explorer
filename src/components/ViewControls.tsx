import React from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { useViewStore } from '../store/viewStore';
import { ZoomControls } from './controls/ZoomControls';
import { ThemeControls } from './controls/ThemeControls';
import { MinimapControl } from './controls/MinimapControl';
import { preventEvent } from '../utils/eventUtils';

const ViewControls: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    showMinimap, 
    toggleMinimap,
  } = useMindMapStore();

  const {
    zoomIn,
    zoomOut,
    fitView,
  } = useViewStore();

  return (
    <>
      <div 
        className="absolute bottom-4 right-4 flex flex-col gap-2"
        onMouseDown={preventEvent}
        onPointerDown={preventEvent}
        onClick={preventEvent}
        onDragStart={preventEvent}
        style={{ pointerEvents: 'auto', zIndex: 1000 }}
      >
        <div className="flex gap-2 items-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-2 rounded-xl shadow-lg border border-blue-100 dark:border-blue-500/30">
          <ZoomControls 
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onFitView={fitView}
          />
          <div className="w-px h-8 bg-blue-100/50" />
          <ThemeControls 
            theme={theme}
            onThemeChange={setTheme}
          />
          <div className="w-px h-8 bg-blue-100/50" />
          <MinimapControl 
            showMinimap={showMinimap}
            onToggle={toggleMinimap}
          />
        </div>
      </div>
    </>
  );
};

export default ViewControls;