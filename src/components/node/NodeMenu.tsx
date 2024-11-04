import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useMenuStore } from '../../store/menuStore';
import { GenerateMenu } from '../GenerateMenu';
import { nodeStyles } from '../../styles/commonStyles';

interface NodeMenuProps {
  id: string;
  showButton: boolean;
  setShowButton: (show: boolean) => void;
}

export const NodeMenu: React.FC<NodeMenuProps> = ({ id, showButton, setShowButton }) => {
  const { activeMenuNodeId, setActiveMenuNodeId } = useMenuStore();
  const showGenerateMenu = activeMenuNodeId === id;
  const hideTimeout = useRef<NodeJS.Timeout>();
  const menuDisplayTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (showGenerateMenu) {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
      if (menuDisplayTimeout.current) {
        clearTimeout(menuDisplayTimeout.current);
      }
      setShowButton(true);
    }
  }, [showGenerateMenu, setShowButton]);

  const handleMenuMouseEnter = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    if (menuDisplayTimeout.current) {
      clearTimeout(menuDisplayTimeout.current);
    }
    setActiveMenuNodeId(id);
    setShowButton(true);
  };

  const handleMenuMouseLeave = () => {
    menuDisplayTimeout.current = setTimeout(() => {
      setActiveMenuNodeId(null);
      hideTimeout.current = setTimeout(() => {
        setShowButton(false);
      }, 1000);
    }, 1000);
  };

  return (
    <div 
      className={`absolute -right-12 top-1/2 -translate-y-1/2 transition-opacity duration-300
        ${showButton ? 'opacity-100' : 'opacity-0'}`}
      onMouseEnter={handleMenuMouseEnter}
      onMouseLeave={handleMenuMouseLeave}
    >
      <button
        className={`${nodeStyles.button} ${nodeStyles.generateButton}`}
        title="AI生成メニューを開く"
      >
        <Sparkles size={16} className={showGenerateMenu ? 'animate-spin' : ''} />
      </button>

      {showGenerateMenu && <GenerateMenu nodeId={id} />}
    </div>
  );
};