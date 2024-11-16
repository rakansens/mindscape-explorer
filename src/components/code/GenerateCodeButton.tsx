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
  const { nodes, addNode } = useMindMapStore();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const codes = await generateCode(nodeId);
      
      // 親ノードを取得
      const parentNode = nodes.find(n => n.id === nodeId);
      if (!parentNode) return;

      // コードを含む新しいノードを作成
      const codeContent = `HTML:\n${codes.html}\n\nCSS:\n${codes.css}\n\nJavaScript:\n${codes.javascript}`;
      addNode(parentNode, "Generated Code", {
        x: parentNode.position.x + 250,
        y: parentNode.position.y
      }, {
        detailedText: codeContent,
        isCode: true
      });

      onGenerate(codes);
      
      toast({
        title: "コード生成完了",
        description: "新しいノードにコードが追加されました",
      });
    } catch (error) {
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