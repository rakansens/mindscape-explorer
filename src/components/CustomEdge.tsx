import React from 'react';
import { EdgeProps, getSmoothStepPath, useStore } from 'reactflow';

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
  markerEnd,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16, // カーブの丸みを増やす
    centerX: (sourceX + targetX) / 2,
    centerY: (sourceY + targetY) / 2,
  });

  return (
    <path
      id={id}
      style={{
        ...style,
        strokeWidth: 2,
        stroke: '#2563eb',
        transition: 'stroke-dasharray 0.2s ease, stroke 0.2s ease',
      }}
      className={`react-flow__edge-path ${data?.animated ? 'animated' : ''}`}
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};

export default CustomEdge;