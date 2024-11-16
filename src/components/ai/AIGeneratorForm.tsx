import { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Sparkles } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useMindMapStore } from '../../store/mindMapStore';
import { useOpenAI } from '../../store/openAIStore';
import { useNodeGenerator } from '../mindmap/NodeGenerator';
import { sleep, animateText } from '../../utils/animationUtils';
import { Button } from '../ui/button';
import { TopicTree } from '../../types/openai';
import { HierarchyItem } from '../../types/common';
import { useApiKeyStore } from '../../store/apiKeyStore';

interface AIGeneratorFormProps {
  onClose: () => void;
  onShowAPIKeyInput: () => void;
}

export function AIGeneratorForm({ onClose, onShowAPIKeyInput }: AIGeneratorFormProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState<'horizontal' | 'radial'>('horizontal');
  
  const { nodes, updateNodeText } = useMindMapStore();
  const { generateSubTopics } = useOpenAI();
  const { fitView } = useReactFlow();
  const { toast } = useToast();
  const { generateNodes } = useNodeGenerator();
  const { openaiKey, geminiKey } = useApiKeyStore();

  const parseTopicTree = (topicTree: TopicTree): HierarchyItem[] => {
    const hierarchy: HierarchyItem[] = [];
    
    const processNode = (node: TopicTree, level: number = 0): HierarchyItem => {
      const item: HierarchyItem = {
        level,
        text: node.label,
        children: []
      };
      
      if (node.children && node.children.length > 0) {
        item.children = node.children.map(child => processNode(child, level + 1));
      }
      
      return item;
    };

    if (topicTree.children) {
      hierarchy.push(...topicTree.children.map(child => processNode(child, 0)));
    }

    return hierarchy;
  };

  const adjustView = () => {
    fitView({
      duration: 500,
      padding: 0.5,
      minZoom: 0.5,
      maxZoom: 1.5
    });
  };

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
        mode: 'quick',
        quickType: 'simple'
      });
      
      const hierarchy = parseTopicTree(response);
      const rootNode = nodes.find(n => n.id === '1');
      
      if (rootNode) {
        await animateText(
          prompt,
          async (text) => {
            updateNodeText(rootNode.id, text);
            adjustView();
          },
          50
        );
        
        await sleep(500);
        
        await generateNodes(rootNode, hierarchy, () => {
          adjustView();
        });

        await sleep(500);
        adjustView();

        toast({
          title: "生成完了",
          description: "マインドマップが生成されました",
        });
      }

      setPrompt('');
      onClose();
    } catch (error) {
      console.error('AI生成エラー:', error);
      toast({
        title: "エラー",
        description: "マインドマップの生成に失敗しました。APIキーを確認してください。",
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
          レイアウトスタイル
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setLayoutStyle('horizontal')}
            className={`flex-1 px-3 py-2 rounded border ${
              layoutStyle === 'horizontal'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            横方向
          </button>
          <button
            onClick={() => setLayoutStyle('radial')}
            className={`flex-1 px-3 py-2 rounded border ${
              layoutStyle === 'radial'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            放射状
          </button>
        </div>
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="探求したいテーマを入力してください..."
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
              <span>マインドマップを生成</span>
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
