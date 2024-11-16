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
    
    // 水平・垂直の距離を比較して最適な接続点を決定
    if (Math.abs(dx) > Math.abs(dy)) {
      // 水平距離が大きい場合
      if (dx > 0) {
        return {
          sourcePos: Position.Right,
          targetPos: Position.Left
        };
      } else {
        return {
          sourcePos: Position.Left,
          targetPos: Position.Right
        };
      }
    } else {
      // 垂直距離が大きい場合
      if (dy > 0) {
        return {
          sourcePos: Position.Bottom,
          targetPos: Position.Top
        };
      } else {
        return {
          sourcePos: Position.Top,
          targetPos: Position.Bottom
        };
      }
    }
  };

  // 最適な接続点を取得
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