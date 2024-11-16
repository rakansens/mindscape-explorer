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

      // LPの各セクションを定義
      const lpSections = [
        { label: 'ヘッダー', description: 'ナビゲーションとヒーローセクション' },
        { label: '特徴・メリット', description: '主要な特徴や利点の説明' },
        { label: '商品・サービス詳細', description: '提供内容の詳細説明' },
        { label: '実績・事例', description: '導入事例や成功事例' },
        { label: 'プラン・料金', description: '価格プランの説明' },
        { label: 'お問い合わせ', description: 'コンタクトフォーム' },
        { label: 'フッター', description: '会社情報とリンク' }
      ];

      // 各セクションに対してノードを生成
      for (let i = 0; i < lpSections.length; i++) {
        const section = lpSections[i];
        const prompt = `
以下のセクションのHTML、CSS、JavaScriptコードを生成してください：
親ノード: ${parentNode.data.label}
セクション: ${section.label}
説明: ${section.description}

コードは実用的でシンプルなものにしてください。
`;
        
        // 新しい位置を計算（円形に配置）
        const angle = (2 * Math.PI * i) / lpSections.length;
        const radius = 300; // 円の半径
        const position = {
          x: parentNode.position.x + radius * Math.cos(angle),
          y: parentNode.position.y + radius * Math.sin(angle)
        };

        try {
          const response = await generateCode(prompt);
          const codes = {
            html: response.html || '',
            css: response.css || '',
            javascript: response.javascript || ''
          };

          // コード内容を整形
          const codeContent = `${section.description}\n\nHTML:\n${codes.html}\n\nCSS:\n${codes.css}\n\nJavaScript:\n${codes.javascript}`;
          
          // 新しいノードを追加
          addNode(parentNode, section.label, position, {
            detailedText: codeContent,
            isCode: true
          });
        } catch (error) {
          console.error(`Error generating code for ${section.label}:`, error);
          // エラーが発生しても続行
          continue;
        }
      }

      toast({
        title: "コード生成完了",
        description: "LPの各セクションのコードが生成されました",
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