import React from 'react';
import { EdgeProps, getBezierPath, getSmoothStepPath, Position } from 'reactflow';
import { useViewStore } from '../store/viewStore';

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
  const { edgeStyle, lineStyle } = useViewStore();

  // Calculate optimal handle positions based on node positions
  const getOptimalHandlePositions = () => {
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    
    // If horizontal distance is greater than vertical distance
    if (Math.abs(dx) > Math.abs(dy)) {
      return {
        sourcePos: dx > 0 ? Position.Right : Position.Left,
        targetPos: dx > 0 ? Position.Left : Position.Right
      };
    }
    // If vertical distance is greater than horizontal distance
    else {
      return {
        sourcePos: dy > 0 ? Position.Bottom : Position.Top,
        targetPos: dy > 0 ? Position.Top : Position.Bottom
      };
    }
  };

  // Get optimal positions
  const { sourcePos, targetPos } = getOptimalHandlePositions();

  const getPath = () => {
    const params = {
      sourceX,
      sourceY,
      sourcePosition: sourcePos,
      targetX,
      targetY,
      targetPosition: targetPos,
    };

    switch (edgeStyle) {
      case 'bezier':
        return getBezierPath(params)[0];
      case 'step':
        return getSmoothStepPath({
          ...params,
          borderRadius: 0,
        })[0];
      case 'smoothstep':
        return getSmoothStepPath({
          ...params,
          borderRadius: 10,
        })[0];
      case 'straight':
        return `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
      default:
        return getBezierPath(params)[0];
    }
  };

  return (
    <path
      id={id}
      style={{
        ...style,
        strokeWidth: 2,
        stroke: '#2563eb',
        strokeDasharray: lineStyle === 'dashed' ? '5,5' : 'none',
      }}
      className={`react-flow__edge-path ${data?.animated ? 'animated' : ''}`}
      d={getPath()}
    />
  );
};

export default CustomEdge;