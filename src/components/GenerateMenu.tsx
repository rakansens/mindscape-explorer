import React from 'react';

interface GenerateMenuProps {
  nodeId: string;
}

export const GenerateMenu: React.FC<GenerateMenuProps> = ({ nodeId }) => {
  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-2 min-w-[200px] z-50">
      <div className="space-y-2">
        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors">
          Quick Generate
        </button>
        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors">
          Detailed Generate
        </button>
        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors">
          Analysis Generate
        </button>
      </div>
    </div>
  );
};