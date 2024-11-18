import React from 'react';
import { useViewStore } from '../store/viewStore';
import { useLayoutStore } from '../store/layoutStore';
import { Button } from './ui/button';
import { Map, Layout, GitBranch, Waves, ArrowRight, Grid, LayoutGrid, LayoutList } from 'lucide-react';
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
    fitView
  } = useViewStore();

  const { layout, setLayout } = useLayoutStore();

  const layouts: { id: LayoutType; label: string; icon: React.ReactNode }[] = [
    { id: 'horizontal', label: '右方向レイアウト', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'layered', label: '階層レイアウト', icon: <LayoutList className="w-4 h-4" /> },
    { id: 'force', label: 'フォースレイアウト', icon: <Grid className="w-4 h-4" /> },
    { id: 'tree', label: 'ツリーレイアウト', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'circle', label: '円形レイアウト', icon: <Layout className="w-4 h-4" /> },
    { id: 'orthogonal', label: '直交レイアウト', icon: <LayoutGrid className="w-4 h-4" /> },
  ];

  const handleLayoutChange = (layoutType: LayoutType) => {
    setLayout({ ...layout, type: layoutType });
    
    // レイアウト変更後に画面中央に表示
    // タイミングを調整して、レイアウトが完全に適用された後にフィットビューを実行
    setTimeout(() => {
      fitView({
        duration: 800, // アニメーション時間を長めに
        padding: 0.2, // パディングを増やして余白を確保
        minZoom: 0.3, // より広い範囲を表示できるように最小ズームを調整
        maxZoom: 2, // より詳細な表示も可能に
        includeHiddenNodes: true // 非表示のノードも考慮
      });
    }, 300); // レイアウト適用完了までの待機時間を増加
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