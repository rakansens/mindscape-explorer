import React from 'react';
import { useViewStore } from '../store/viewStore';
import { useLayoutStore } from '../store/layoutStore';
import { useMindMapStore } from '../store/mindMapStore';
import { Button } from './ui/button';
import { 
  Map,
  ArrowRight,
  ArrowDown,
  Circle,
  Network,
  GitFork,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Tooltip } from './Tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { EdgeStyleMenu } from './controls/EdgeStyleMenu';
import { ThemeMenu } from './controls/ThemeMenu';
import { LayoutType } from '../types/layout';

export const ViewControls = () => {
  const {
    theme,
    setTheme,
    showMinimap,
    toggleMinimap,
    edgeStyle,
    setEdgeStyle,
    lineStyle,
    setLineStyle,
    fitView,
  } = useViewStore();

  const { nodes } = useMindMapStore();
  const { layout, setLayout, toggleCompactMode } = useLayoutStore();

  const layouts: { id: LayoutType; label: string; icon: React.ReactNode }[] = [
    { id: 'horizontal', label: '右方向レイアウト', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'layered', label: '階層レイアウト', icon: <ArrowDown className="w-4 h-4" /> },
    { id: 'force', label: 'フォースレイアウト', icon: <Network className="w-4 h-4" /> },
    { id: 'tree', label: 'ツリーレイアウト', icon: <GitFork className="w-4 h-4" /> },
    { id: 'circle', label: '円形レイアウト', icon: <Circle className="w-4 h-4" /> },
    { id: 'radial', label: '放射状レイアウト', icon: <Network className="w-4 h-4" rotate={45} /> },
  ];

  const handleLayoutChange = (layoutType: LayoutType) => {
    setLayout({ ...layout, type: layoutType });
    
    setTimeout(() => {
      fitView({
        duration: 600,
        padding: 0.5,
      });
    }, 100);
  };

  return (
    <div className="absolute bottom-4 right-4 flex gap-2">
      <Tooltip text={showMinimap ? "ミニマップを非表示" : "ミニマップを表示"} position="top">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMinimap}
          className={`
            p-2 rounded-lg transition-colors
            ${showMinimap ? 'bg-blue-100/50 text-blue-500' : 'hover:bg-blue-100/50 text-blue-500'}
          `}
        >
          <Map className="w-5 h-5" />
        </Button>
      </Tooltip>

      <Tooltip text={layout.isCompact ? "標準間隔に戻す" : "ノード間隔を詰める"} position="top">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCompactMode}
          className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
        >
          {layout.isCompact ? (
            <Maximize2 className="w-5 h-5" />
          ) : (
            <Minimize2 className="w-5 h-5" />
          )}
        </Button>
      </Tooltip>

      <EdgeStyleMenu
        edgeStyle={edgeStyle}
        setEdgeStyle={setEdgeStyle}
        lineStyle={lineStyle}
        setLineStyle={setLineStyle}
      />

      <DropdownMenu>
        <Tooltip text="レイアウトを変更" position="top">
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
            >
              <Network className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent align="end" className="p-2 grid grid-cols-3 gap-2 min-w-[240px]">
          {layouts.map((l) => (
            <button
              key={l.id}
              onClick={() => handleLayoutChange(l.id)}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors
                ${layout.type === l.id ? 'ring-2 ring-primary' : ''}
              `}
            >
              {l.icon}
            </button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ThemeMenu theme={theme} setTheme={setTheme} />
    </div>
  );
};