import React from 'react';
import { Handle, Position } from 'reactflow';

export const NodeHandles: React.FC = () => {
  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-2 h-2 bg-primary/50" 
        id="left"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-2 h-2 bg-primary/50" 
        id="right"
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-2 h-2 bg-primary/50" 
        id="top"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-2 h-2 bg-primary/50" 
        id="bottom"
      />
    </>
  );
};