import React from 'react';
import { EdgeProps, getBezierPath, getSmoothStepPath, Position } from 'reactflow';
import { useViewStore } from '../store/viewStore';

interface CustomEdgeProps extends EdgeProps {
  data?: {
    animated?: boolean;
  };
  sourceHandle?: string;
  targetHandle?: string;
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
  sourceHandle,
  targetHandle,
}) => {
  const { edgeStyle, lineStyle } = useViewStore();

  const getHandlePositions = () => {
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    
    if (sourceHandle && targetHandle) {
      return {
        sourcePos: sourceHandle === 'right' ? Position.Right :
                  sourceHandle === 'left' ? Position.Left :
                  sourceHandle === 'top' ? Position.Top :
                  Position.Bottom,
        targetPos: targetHandle === 'right' ? Position.Right :
                  targetHandle === 'left' ? Position.Left :
                  targetHandle === 'top' ? Position.Top :
                  Position.Bottom
      };
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 
        ? { sourcePos: Position.Right, targetPos: Position.Left }
        : { sourcePos: Position.Left, targetPos: Position.Right };
    } else {
      return dy > 0
        ? { sourcePos: Position.Bottom, targetPos: Position.Top }
        : { sourcePos: Position.Top, targetPos: Position.Bottom };
    }
  };

  const { sourcePos, targetPos } = getHandlePositions();

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

  const baseStyle = {
    strokeWidth: 2,
    stroke: '#2563eb',
    strokeDasharray: lineStyle === 'dashed' ? '5,5' : 'none',
  };

  return (
    <path
      id={id}
      style={baseStyle}
      className={`react-flow__edge-path ${data?.animated ? 'animated' : ''}`}
      d={getPath()}
    />
  );
};

export default CustomEdge;