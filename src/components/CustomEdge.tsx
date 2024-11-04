import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

interface CustomEdgeProps extends EdgeProps {
  data?: {
    animated?: boolean;
  };
}

const CustomEdge: React.FC<CustomEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      style={{
        ...style,
        strokeWidth: 2,
        stroke: '#2563eb',
      }}
      className={`react-flow__edge-path ${data?.animated ? 'animated' : ''}`}
      d={edgePath}
    />
  );
};

export default CustomEdge;