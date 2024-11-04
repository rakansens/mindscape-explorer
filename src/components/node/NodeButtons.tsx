import React, { useRef } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useMenuStore } from '../../store/menuStore';
import { nodeStyles } from '../../styles/commonStyles';
import { GenerateMenu } from '../GenerateMenu';

interface NodeButtonsProps {
  id: string;
  showButton: boolean;
  onRegenerateClick: () => void;
  isRegenerating?: boolean;
}

export const NodeButtons: React.FC<NodeButtonsProps> = ({
  id,
  showButton,
  onRegenerateClick,
  isRegenerating
}) => {
  const { activeMenuNodeId, setActiveMenuNodeId } = useMenuStore();
  const showGenerateMenu = activeMenuNodeId === id;
  const buttonRef = useRef<HTMLButtonElement>(null);
  let hideTimeout = useRef<NodeJS.Timeout>();

  const handleMenuMouseEnter = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    setActiveMenuNodeId(id);
  };

  const handleMenuMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setActiveMenuNodeId(null);
    }, 1000);
  };

  return (
    <div 
      className="absolute -right-24 top-1/2 -translate-y-1/2 flex gap-2 transition-opacity duration-300"
      onMouseEnter={handleMenuMouseEnter}
      onMouseLeave={handleMenuMouseLeave}
    >
      <button
        onClick={onRegenerateClick}
        disabled={isRegenerating}
        className={`${nodeStyles.button} ${nodeStyles.generateButton}
          hover:rotate-180 transition-transform duration-300`}
        title="このノードを再生成"
      >
        <RefreshCw 
          size={16} 
          className={isRegenerating ? 'animate-spin' : ''}
        />
      </button>

      <button
        ref={buttonRef}
        className={`${nodeStyles.button} ${nodeStyles.generateButton}
          ${showGenerateMenu ? 'bg-blue-50' : ''}`}
        title="AI生成メニューを開く"
      >
        <Sparkles size={16} />
      </button>

      {showGenerateMenu && <GenerateMenu nodeId={id} />}
    </div>
  );
};