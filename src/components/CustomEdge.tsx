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
  const { edgeStyle, lineStyle, theme } = useViewStore();

  // テーマに基づいてエッジの色を決定
  const getEdgeColor = () => {
    switch(theme) {
      case 'dark':
        return '#6366f1'; // indigo-500
      case 'blue':
        return '#3b82f6'; // blue-500
      case 'purple':
        return '#a855f7'; // purple-500
      case 'sepia':
        return '#d97706'; // amber-600
      case 'mint':
        return '#10b981'; // emerald-500
      case 'rose':
        return '#f43f5e'; // rose-500
      case 'sunset':
        return '#f97316'; // orange-500
      case 'ocean':
        return '#06b6d4'; // cyan-500
      default:
        return '#3b82f6'; // blue-500 (default)
    }
  };

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
    stroke: getEdgeColor(),
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