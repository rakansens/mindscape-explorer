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
      const parentNode = nodes.find(n => n.id === nodeId);
      if (!parentNode) return;

      // トピックに基づいて生成するコードの種類を定義
      const codeTypes = [
        { label: 'コンポーネント', description: 'Reactコンポーネントの実装' },
        { label: 'スタイル', description: 'スタイリングとアニメーション' },
        { label: 'ユーティリティ', description: 'ヘルパー関数と型定義' },
        { label: 'テスト', description: 'ユニットテストとE2Eテスト' }
      ];

      // 各コードタイプに対してノードを生成
      for (const type of codeTypes) {
        try {
          // 新しい位置を計算（円形に配置）
          const angle = (2 * Math.PI * codeTypes.indexOf(type)) / codeTypes.length;
          const radius = 300; // 円の半径
          const position = {
            x: parentNode.position.x + radius * Math.cos(angle),
            y: parentNode.position.y + radius * Math.sin(angle)
          };

          // コードを生成
          const codes = await generateCode(nodeId);
          
          // コード内容を整形
          const codeContent = `${type.description}\n\nHTML:\n${codes.html || ''}\n\nCSS:\n${codes.css || ''}\n\nJavaScript:\n${codes.javascript || ''}`;
          
          // 新しいノードを追加
          addNode(parentNode, `${parentNode.data.label}の${type.label}`, position, {
            detailedText: codeContent,
            isCode: true
          });

        } catch (error) {
          console.error(`Error generating code for ${type.label}:`, error);
          toast({
            title: `${type.label}の生成エラー`,
            description: "このノードのコード生成に失敗しましたが、他のノードの生成を続行します",
            variant: "destructive",
          });
          continue;
        }
      }

      toast({
        title: "コード生成完了",
        description: "関連するコードノードが生成されました",
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