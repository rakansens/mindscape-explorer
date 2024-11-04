import React from 'react';
import { Sparkles, ChevronDown, ChevronRight, CheckSquare, Square, RefreshCw } from 'lucide-react';
import { useMenuStore } from '../../store/menuStore';
import { nodeStyles } from '../../styles/commonStyles';
import { GenerateMenu } from '../GenerateMenu';

interface NodeButtonsProps {
  nodeId: string;
  showButton: boolean;
  isCollapsed: boolean;
  isTask?: boolean;
  isCompleted?: boolean;
  hasDetailedText?: boolean;
  onToggleCollapse: (e: React.MouseEvent) => void;
  onToggleTaskCompletion: (e: React.MouseEvent) => void;
  onRegenerate: (e: React.MouseEvent) => void;
}

export const NodeButtons: React.FC<NodeButtonsProps> = ({
  nodeId,
  showButton,
  isCollapsed,
  isTask,
  isCompleted,
  hasDetailedText,
  onToggleCollapse,
  onToggleTaskCompletion,
  onRegenerate,
}) => {
  const { activeMenuNodeId, setActiveMenuNodeId } = useMenuStore();
  const showGenerateMenu = activeMenuNodeId === nodeId;
  let hideTimeout = React.useRef<NodeJS.Timeout>();

  const handleMenuMouseEnter = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    setActiveMenuNodeId(nodeId);
  };

  const handleMenuMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setActiveMenuNodeId(null);
    }, 1000);
  };

  return (
    <>
      {hasDetailedText && (
        <button
          onClick={onToggleCollapse}
          className="text-white hover:bg-white/10 rounded p-1"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>
      )}
      {isTask && (
        <button
          onClick={onToggleTaskCompletion}
          className="text-white hover:bg-white/10 rounded p-1"
        >
          {isCompleted ? 
            <CheckSquare size={16} className="text-green-300" /> : 
            <Square size={16} />
          }
        </button>
      )}
      <button
        onClick={onRegenerate}
        className="text-white hover:bg-white/10 rounded p-1"
        title="AIで再生成"
      >
        <RefreshCw size={16} />
      </button>
      <div 
        className={`absolute -right-12 top-1/2 -translate-y-1/2 transition-opacity duration-300
          ${showButton ? 'opacity-100' : 'opacity-0'}`}
        onMouseEnter={handleMenuMouseEnter}
        onMouseLeave={handleMenuMouseLeave}
      >
        <button
          className={`${nodeStyles.button} ${nodeStyles.generateButton}
            ${showGenerateMenu ? 'bg-blue-50' : ''}`}
          title="AI生成メニューを開く"
        >
          <Sparkles size={16} />
        </button>

        {showGenerateMenu && <GenerateMenu nodeId={nodeId} />}
      </div>
    </>
  );
};