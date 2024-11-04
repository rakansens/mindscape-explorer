import React from 'react';
import { preventEvent } from '../../utils/eventUtils';

interface ThemeControlsProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export const ThemeControls: React.FC<ThemeControlsProps> = ({
  theme,
  onThemeChange
}) => (
  <div className="flex gap-1">
    <button
      onClick={(e) => {
        preventEvent(e);
        onThemeChange('light');
      }}
      className={`p-2 rounded-lg transition-colors ${
        theme === 'light' 
          ? 'bg-blue-100/50 text-blue-600' 
          : 'hover:bg-blue-100/50 text-blue-500'
      }`}
      title="ライトテーマ"
      style={{ cursor: 'pointer' }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </button>
    <button
      onClick={(e) => {
        preventEvent(e);
        onThemeChange('dark');
      }}
      className={`p-2 rounded-lg transition-colors ${
        theme === 'dark'
          ? 'bg-blue-100/50 text-blue-600'
          : 'hover:bg-blue-100/50 text-blue-500'
      }`}
      title="ダークテーマ"
      style={{ cursor: 'pointer' }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  </div>
);