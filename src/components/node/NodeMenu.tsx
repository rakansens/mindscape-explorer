import React, { useRef, useEffect } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { useMenuStore } from '../../store/menuStore';
import { GenerateMenu } from '../GenerateMenu';
import { nodeStyles } from '../../styles/commonStyles';
import { useMindMapStore } from '../../store/mindMapStore';

interface NodeMenuProps {
  id: string;
  showButton: boolean;
  setShowButton: (show: boolean) => void;
}

export const NodeMenu: React.FC<NodeMenuProps> = ({ id, showButton, setShowButton }) => {
  const { activeMenuNodeId, setActiveMenuNodeId } = useMenuStore();
  const { addNode, nodes } = useMindMapStore();
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

  const handleGenerateButtonMouseEnter = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    if (menuDisplayTimeout.current) {
      clearTimeout(menuDisplayTimeout.current);
    }
    setActiveMenuNodeId(id);
    setShowButton(true);
  };

  const handleGenerateButtonMouseLeave = () => {
    menuDisplayTimeout.current = setTimeout(() => {
      setActiveMenuNodeId(null);
      hideTimeout.current = setTimeout(() => {
        setShowButton(false);
      }, 1000);
    }, 1000);
  };

  const handleAddNode = () => {
    const currentNode = nodes.find(n => n.id === id);
    if (currentNode) {
      addNode(currentNode, 'New Node', {
        x: currentNode.position.x + 250,
        y: currentNode.position.y
      });
    }
  };

  return (
    <div 
      className={`absolute -right-12 top-1/2 -translate-y-1/2 transition-opacity duration-300 flex flex-col gap-2
        ${showButton ? 'opacity-100' : 'opacity-0'}`}
    >
      <button
        onClick={handleAddNode}
        className={`${nodeStyles.button} ${nodeStyles.generateButton}`}
      >
        <Plus size={16} />
      </button>

      <div
        onMouseEnter={handleGenerateButtonMouseEnter}
        onMouseLeave={handleGenerateButtonMouseLeave}
      >
        <button
          className={`${nodeStyles.button} ${nodeStyles.generateButton}`}
        >
          <Sparkles size={16} />
        </button>

        {showGenerateMenu && <GenerateMenu nodeId={id} />}
      </div>
    </div>
  );
};