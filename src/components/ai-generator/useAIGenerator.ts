import { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { useMindMapStore } from '../../store/mindMapStore';
import { useOpenAI, TopicTree } from '../../utils/openai';

type LayoutStyle = 'horizontal' | 'radial';

interface HierarchyItem {
  level: number;
  text: string;
  children: HierarchyItem[];
}

export const useAIGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>('horizontal');
  const { addNode, nodes, updateNodeText } = useMindMapStore();
  const { generateSubTopics, apiKey } = useOpenAI();
  const { fitView } = useReactFlow();

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

  const generateNodes = async (
    parentNode: any,
    items: HierarchyItem[],
    level: number = 0
  ) => {
    for (const [index, item] of items.entries()) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const newNode = addNode(parentNode, item.text);
      if (item.children && item.children.length > 0) {
        await generateNodes(newNode, item.children, level + 1);
      }
    }
  };

  const handleGenerate = async (prompt: string) => {
    if (!apiKey) {
      alert('OpenAI APIキーを設定してください');
      return;
    }

    if (!prompt.trim()) {
      alert('テーマを入力してください');
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
        updateNodeText(rootNode.id, prompt);
        
        fitView({ 
          duration: 800,
          padding: 0.5,
        });

        await generateNodes(rootNode, hierarchy);

        setTimeout(() => {
          fitView({ 
            duration: 800,
            padding: 0.3,
            minZoom: 0.4,
            maxZoom: 1,
          });
        }, 1000);
      }
    } catch (error) {
      console.error('AI生成エラー:', error);
      alert('マインドマップの生成に失敗しました。APIキーを確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    layoutStyle,
    setLayoutStyle,
    handleGenerate
  };
};