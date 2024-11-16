import React from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { DetailedTextEditor } from '../DetailedTextEditor';
import { LoadingAnimation } from '../animations/LoadingAnimation';
import { TypingAnimation } from '../animations/TypingAnimation';
import { NodeData } from '../../types/node';
import { useMindMapStore } from '../../store/mindMapStore';
import { useViewStore } from '../../store/viewStore';

interface NodeContentProps {
  id: string;
  data: NodeData;
  isEditing: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleEditComplete: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const NodeContent: React.FC<NodeContentProps> = ({
  id,
  data,
  isEditing,
  inputValue,
  setInputValue,
  handleEditComplete,
  inputRef,
}) => {
  const store = useMindMapStore();
  const { setNodeAnimating } = useViewStore();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  const toggleTaskCompletion = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.updateNode(id, {
      isCompleted: !data.isCompleted
    });
  };

  const renderLabel = () => {
    if (data.isGenerating) {
      return <LoadingAnimation />;
    }
    if (data.isAppearing && data.label) {
      return (
        <TypingAnimation 
          text={data.label} 
          onComplete={() => {
            store.updateNode(id, { isAppearing: false });
            setNodeAnimating(id, false);
          }} 
        />
      );
    }
    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleEditComplete}
          className="bg-transparent text-white outline-none w-full"
          autoFocus
        />
      );
    }
    return <span className="text-white">{data.label}</span>;
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        {data.detailedText && (
          <button
            onClick={toggleCollapse}
            className="text-white hover:bg-white/10 rounded p-1"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
        {data.isTask && (
          <button
            onClick={toggleTaskCompletion}
            className="text-white hover:bg-white/10 rounded p-1"
          >
            {data.isCompleted ? (
              <CheckSquare className="w-4 h-4 text-green-300" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
        )}
        
        {renderLabel()}
      </div>

      {data.detailedText && !isCollapsed && (
        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="max-h-[200px] overflow-y-auto" style={{ width: '250px' }}>
            <DetailedTextEditor 
              nodeId={id} 
              initialText={data.detailedText}
            />
          </div>
        </div>
      )}
    </div>
  );
};