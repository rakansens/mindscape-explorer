import React from 'react';
import { EdgeProps, getBezierPath, getSmoothStepPath } from 'reactflow';
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

  // 接続点の最適な位置を計算
  const getOptimalHandlePositions = () => {
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    
    // 水平方向の距離が垂直方向より大きい場合
    if (Math.abs(dx) > Math.abs(dy)) {
      return {
        source: dx > 0 ? 'right' : 'left',
        target: dx > 0 ? 'left' : 'right'
      };
    }
    // 垂直方向の距離が水平方向より大きい場合
    else {
      return {
        source: dy > 0 ? 'bottom' : 'top',
        target: dy > 0 ? 'top' : 'bottom'
      };
    }
  };

  const { source, target } = getOptimalHandlePositions();

  const getPath = () => {
    const params = {
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
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