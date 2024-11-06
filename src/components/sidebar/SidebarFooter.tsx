import React from 'react';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';

interface SidebarFooterProps {
  onSave: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ onSave }) => {
  return (
    <div className="p-4 border-t">
      <Button
        variant="secondary"
        className="w-full"
        onClick={onSave}
      >
        <Save className="h-4 w-4 mr-2" />
        現在のマップを保存
      </Button>
    </div>
  );
}; 