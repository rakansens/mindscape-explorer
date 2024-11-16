import React from 'react';
import { useViewStore } from '../store/viewStore';
import { Button } from './ui/button';
import { Sun, Moon, Map, Palette } from 'lucide-react';
import { Tooltip } from './Tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const ViewControls = () => {
  const {
    theme,
    setTheme,
    showMinimap,
    toggleMinimap
  } = useViewStore();

  const themeLabels = {
    light: 'ライトモード',
    dark: 'ダークモード',
    blue: 'ブルーテーマ',
    purple: 'パープルテーマ',
    sepia: 'セピアテーマ'
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

      <DropdownMenu>
        <Tooltip text="テーマを変更" position="top">
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
            >
              <Palette className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent align="end">
          {Object.entries(themeLabels).map(([themeKey, label]) => (
            <DropdownMenuItem
              key={themeKey}
              onClick={() => setTheme(themeKey as any)}
              className={theme === themeKey ? 'bg-accent' : ''}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip text={theme === 'light' ? "ダークモードに切り替え" : "ライトモードに切り替え"} position="top">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </Button>
      </Tooltip>
    </div>
  );
};