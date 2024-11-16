import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface AIGeneratorButtonProps {
  onClick: () => void;
}

export function AIGeneratorButton({ onClick }: AIGeneratorButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="p-3 rounded-full shadow-lg"
      variant="default"
    >
      <Sparkles size={24} />
    </Button>
  );
}