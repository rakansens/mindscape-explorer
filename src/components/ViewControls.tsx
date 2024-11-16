import React from 'react';
import { useViewStore } from '../store/viewStore';
import { useLayoutStore } from '../store/layoutStore';
import { Button } from './ui/button';
import { Map, Layout, GitBranch, Waves, ArrowRight, Grid, Bold, Italic } from 'lucide-react';
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
    setLineStyle
  } = useViewStore();

  const { layout, setLayout } = useLayoutStore();

  const layouts: { id: LayoutType; label: string; icon: string }[] = [
    { id: 'horizontal', label: '右方向レイアウト', icon: 'arrow-right' },
    { id: 'layered', label: '階層レイアウト', icon: 'layers' },
    { id: 'force', label: 'フォースレイアウト', icon: 'move' },
    { id: 'tree', label: 'ツリーレイアウト', icon: 'git-branch' },
    { id: 'circle', label: '円形レイアウト', icon: 'circle' },
    { id: 'orthogonal', label: '直交レイアウト', icon: 'layout' },
  ];

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
              <Layout className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent align="end" className="p-2 grid grid-cols-1 gap-2 min-w-[150px]">
          {layouts.map((l) => (
            <button
              key={l.id}
              onClick={() => setLayout({ ...layout, type: l.id })}
              className={`
                flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors
                ${layout.type === l.id ? 'ring-2 ring-primary' : ''}
              `}
            >
              <span className="text-sm">{l.label}</span>
            </button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ThemeMenu theme={theme} setTheme={setTheme} />
    </div>
  );
};