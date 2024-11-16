import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Sparkles } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useMindMapStore } from '../../store/mindMapStore';
import { useOpenAI } from '../../utils/openai';
import { useNodeGenerator } from '../mindmap/NodeGenerator';
import { Button } from '../ui/button';
import { useApiKeyStore } from '../../store/apiKeyStore';
import { Select } from '../ui/select';

interface BulkGeneratorFormProps {
  onClose: () => void;
  onShowAPIKeyInput: () => void;
}

export function BulkGeneratorForm({ onClose, onShowAPIKeyInput }: BulkGeneratorFormProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [complexity, setComplexity] = useState<'simple' | 'complex'>('simple');
  
  const { nodes, updateNode } = useMindMapStore();
  const { generateSubTopics } = useOpenAI();
  const { fitView } = useReactFlow();
  const { toast } = useToast();
  const { generateNodes } = useNodeGenerator();
  const { openaiKey, geminiKey } = useApiKeyStore();

  const handleGenerate = async () => {
    const modelConfig = useMindMapStore.getState().modelConfig;
    const isGemini = modelConfig?.type.includes('GEMINI');
    
    if ((isGemini && !geminiKey) || (!isGemini && !openaiKey)) {
      onShowAPIKeyInput();
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "エラー",
        description: "テーマを入力してください",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await generateSubTopics(prompt, {
        mode: complexity === 'complex' ? 'detailed' : 'quick',
        structure: {
          level1: complexity === 'complex' ? 4 : 3,
          level2: complexity === 'complex' ? 3 : 2,
          level3: complexity === 'complex' ? 2 : 0,
        }
      });

      const rootNode = nodes.find(n => n.id === '1');
      if (!rootNode) return;

      updateNode(rootNode.id, {
        label: prompt,
        isGenerating: false
      });

      await generateNodes(rootNode, [response], () => {
        fitView({
          duration: 500,
          padding: 0.5
        });
      });

      toast({
        title: "生成完了",
        description: "マインドマップが生成されました",
      });

      onClose();
    } catch (error) {
      console.error('AI生成エラー:', error);
      toast({
        title: "エラー",
        description: "マインドマップの生成に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          生成の複雑さ
        </label>
        <Select
          value={complexity}
          onValueChange={(value) => setComplexity(value as 'simple' | 'complex')}
        >
          <option value="simple">シンプル (3層まで)</option>
          <option value="complex">複雑 (4層以上)</option>
        </Select>
      </div>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="生成したいコンポーネントやページの概要を入力..."
        className="w-80 h-32 p-2 border rounded mb-2 resize-none"
      />
      
      <div className="flex gap-2">
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex-1 items-center justify-center gap-2"
          variant="default"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>生成中...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>一括生成</span>
            </>
          )}
        </Button>
        <Button
          onClick={onClose}
          variant="secondary"
        >
          キャンセル
        </Button>
      </div>
    </div>
  );
}