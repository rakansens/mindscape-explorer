import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface SaveConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  mode: 'save' | 'new';
  defaultTitle?: string;
}

export const SaveConfirmDialog: React.FC<SaveConfirmDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  defaultTitle = '無題のマインドマップ'
}) => {
  const [title, setTitle] = useState(defaultTitle);

  useEffect(() => {
    if (isOpen) {
      setTitle(defaultTitle);
    }
  }, [isOpen, defaultTitle]);

  const handleSave = () => {
    onSave(title);
    setTitle('無題のマインドマップ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'save' ? 'マインドマップを保存' : '新規マインドマップ'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2"
            placeholder="マインドマップのタイトルを入力してください"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>
            {mode === 'save' ? '保存' : '作成'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 