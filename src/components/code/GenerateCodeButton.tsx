import React from 'react';
import { FileCode } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { useOpenAI } from '../../utils/openai';
import { useMindMapStore } from '../../store/mindMapStore';

interface GenerateCodeButtonProps {
  nodeId: string;
  onGenerate: (codes: { html?: string; css?: string; javascript?: string }) => void;
}

export const GenerateCodeButton: React.FC<GenerateCodeButtonProps> = ({
  nodeId,
  onGenerate
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { generateCode } = useOpenAI();
  const { toast } = useToast();
  const { nodes } = useMindMapStore();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const codes = await generateCode(nodeId);
      onGenerate(codes);
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: "エラー",
        description: "コードの生成に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className="w-8 h-8 p-0"
    >
      <FileCode className="h-4 w-4 text-gray-600" />
    </Button>
  );
};