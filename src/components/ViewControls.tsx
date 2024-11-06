import React from 'react';
import { useViewStore } from '../store/viewStore';
import { Button } from './ui/button';
import { Sun, Moon, Map } from 'lucide-react';
import { Tooltip } from './Tooltip';

export const ViewControls = () => {
  const {
    theme,
    setTheme,
    showMinimap,
    toggleMinimap
  } = useViewStore();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
      <Tooltip text={theme === 'light' ? "ダークモードに切り替え" : "ライトモードに切り替え"} position="top">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
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