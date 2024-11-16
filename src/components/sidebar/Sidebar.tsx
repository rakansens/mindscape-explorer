import React, { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';
import { useMindMapStore } from '../../store/mindMapStore';
import { useViewStore } from '../../store/viewStore';
import { SidebarHeader } from './SidebarHeader';
import { SidebarContent } from './SidebarContent';
import { SidebarFooter } from './SidebarFooter';
import { SidebarToggle } from './SidebarToggle';
import { APIKeyInputDialog } from '../api/APIKeyInputDialog';
import { useOpenAI } from '../../store/openAIStore';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { SaveConfirmDialog } from '../dialog/SaveConfirmDialog';

// Sidebar component is getting too large, so we'll split it into smaller components
export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAPIKeyInput, setShowAPIKeyInput] = useState(false);
  const { theme } = useViewStore();
  const { apiKey } = useOpenAI();

  // Get theme-specific styles
  const sidebarStyles = {
    base: "fixed left-0 top-0 h-full transition-all duration-300 z-40 border-r border-border",
    width: isOpen ? "w-72" : "w-0",
    theme: {
      light: "bg-background",
      dark: "bg-gray-950",
      blue: "bg-blue-50",
      purple: "bg-purple-50",
      sepia: "bg-amber-50",
      mint: "bg-emerald-50",
      rose: "bg-rose-50",
      sunset: "bg-orange-50",
      ocean: "bg-cyan-50"
    }[theme]
  };

  return (
    <>
      <div className={cn(sidebarStyles.base, sidebarStyles.width, sidebarStyles.theme)}>
        <SidebarToggle isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

        <div className={cn(
          "h-full flex flex-col transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}>
          <SidebarHeader />

          {!apiKey && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAPIKeyInput(true)}
              className="ml-4 mb-2 text-muted-foreground hover:text-foreground"
            >
              <Settings2 className="w-4 h-4" />
            </Button>
          )}

          <SidebarContent />
          <SidebarFooter />
        </div>
      </div>

      {showAPIKeyInput && (
        <APIKeyInputDialog
          onSubmit={(config) => {
            setShowAPIKeyInput(false);
          }}
          onClose={() => setShowAPIKeyInput(false)}
        />
      )}
    </>
  );
};