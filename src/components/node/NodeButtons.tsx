import React from 'react';
import { Sparkles, RotateCw } from 'lucide-react';
import { nodeStyles } from '../../styles/commonStyles';
import { useMenuStore } from '../../store/menuStore';
import { GenerateMenu } from '../GenerateMenu';

interface NodeButtonsProps {
  nodeId: string;
  showButton: boolean;
  onRegenerateClick: () => void;
  isRegenerating?: boolean;
}

export const NodeButtons: React.FC<NodeButtonsProps> = ({
  nodeId,
  showButton,
  onRegenerateClick,
  isRegenerating
}) => {
  const { activeMenuNodeId, setActiveMenuNodeId } = useMenuStore();
  const showGenerateMenu = activeMenuNodeId === nodeId;
  let hideTimeout: NodeJS.Timeout;

  const handleMenuMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    setActiveMenuNodeId(nodeId);
  };

  const handleMenuMouseLeave = () => {
    hideTimeout = setTimeout(() => {
      setActiveMenuNodeId(null);
    }, 1000);
  };

  return (
    <div 
      className={`absolute -right-24 top-1/2 -translate-y-1/2 transition-opacity duration-300 flex gap-2
        ${showButton ? 'opacity-100' : 'opacity-0'}`}
      onMouseEnter={handleMenuMouseEnter}
      onMouseLeave={handleMenuMouseLeave}
    >
      <button
        onClick={onRegenerateClick}
        disabled={isRegenerating}
        className={`${nodeStyles.button} text-blue-500 hover:text-blue-600 hover:bg-blue-50`}
        title="AIで再生成"
      >
        <RotateCw 
          size={16} 
          className={isRegenerating ? 'animate-spin' : ''}
        />
      </button>
      <button
        className={`${nodeStyles.button} ${nodeStyles.generateButton}
          ${showGenerateMenu ? 'bg-blue-50' : ''}`}
        title="AI生成メニューを開く"
      >
        <Sparkles size={16} />
      </button>

      {showGenerateMenu && <GenerateMenu nodeId={nodeId} />}
    </div>
  );
};