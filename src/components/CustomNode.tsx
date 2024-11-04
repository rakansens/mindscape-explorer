import React from 'react';
import { Handle, Position } from 'reactflow';

interface CustomNodeProps {
  data: {
    label: string;
  };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default CustomNode;