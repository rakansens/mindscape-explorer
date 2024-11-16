import { useState } from 'react';
import { Panel, useReactFlow } from 'reactflow';
import { Sparkles } from 'lucide-react';
import { useMindMapStore } from '../store/mindMapStore';
import { useOpenAI } from '../store/openAIStore';
import { useToast } from '../hooks/use-toast';
import { sleep, animateText } from '../utils/animationUtils';
import { useNodeGenerator } from './mindmap/NodeGenerator';
import { APIKeyInput } from './APIKeyInput';
import { TopicTree } from '../types/openai';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { HierarchyItem } from '../types/common';

export function AIGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAPIKeyInput, setShowAPIKeyInput] = useState(true); // デフォルトで表示
  const [layoutStyle, setLayoutStyle] = useState<'horizontal' | 'radial'>('horizontal');
  
  const { nodes, updateNodeText } = useMindMapStore();
  const { generateSubTopics, apiKey, setApiKey } = useOpenAI();
  const { fitView } = useReactFlow();
  const { toast } = useToast();
  const { generateNodes } = useNodeGenerator();

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
    if (!apiKey) {
      setShowAPIKeyInput(true);
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
      setIsOpen(false);
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
    <>
      {showAPIKeyInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">APIキー設定</h2>
            <APIKeyInput
              onSubmit={({ type, apiKey, geminiKey }) => {
                setApiKey(apiKey);
                setShowAPIKeyInput(false);
                toast({
                  title: "設定完了",
                  description: "APIキーを設定しました",
                });
              }}
            />
          </div>
        </div>
      )}
      <Panel position="bottom-right" className="mr-4 mb-4">
        <div className="flex flex-col gap-2">
          {!apiKey && (
            <Button
              onClick={() => setShowAPIKeyInput(true)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              APIキーを設定
            </Button>
          )}
          {isOpen ? (
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
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center gap-2"
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
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 shadow-lg"
            >
              <Sparkles size={24} />
            </button>
          )}
        </div>
      </Panel>
    </>
  );
}