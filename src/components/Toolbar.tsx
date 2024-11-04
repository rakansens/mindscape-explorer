import React from 'react';
import { SaveLoadButtons } from './toolbar/SaveLoadButtons';
import { JsonButtons } from './toolbar/JsonButtons';
import { ExportButtons } from './toolbar/ExportButtons';
import { APIKeyButton } from './toolbar/APIKeyButton';
import { ColorSchemeSelector } from './ColorSchemeSelector';

export const Toolbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <SaveLoadButtons />
            <JsonButtons />
            <ExportButtons />
          </div>
          <div className="flex items-center gap-4">
            <ColorSchemeSelector />
            <APIKeyButton />
          </div>
        </div>
      </div>
    </div>
  );
};