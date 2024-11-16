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
        return 'url(#gradient-dark)';
      case 'blue':
        return 'url(#gradient-blue)';
      case 'purple':
        return 'url(#gradient-purple)';
      case 'sepia':
        return 'url(#gradient-sepia)';
      case 'mint':
        return 'url(#gradient-mint)';
      case 'rose':
        return 'url(#gradient-rose)';
      case 'sunset':
        return 'url(#gradient-sunset)';
      case 'ocean':
        return 'url(#gradient-ocean)';
      default:
        return 'url(#gradient-default)';
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

  const getLineStyle = () => {
    const baseWidth = 2;
    const color = getEdgeColor();

    switch (lineStyle) {
      case 'double':
        return {
          strokeWidth: baseWidth,
          stroke: color,
          filter: 'url(#double-line)',
        };
      case 'wavy':
        return {
          strokeWidth: baseWidth,
          stroke: color,
          filter: 'url(#wavy-line)',
        };
      case 'gradient':
        return {
          strokeWidth: baseWidth,
          stroke: color,
        };
      case 'varying':
        return {
          strokeWidth: baseWidth,
          stroke: color,
          filter: 'url(#varying-width)',
        };
      default:
        return {
          strokeWidth: baseWidth,
          stroke: color,
          strokeDasharray: lineStyle === 'dashed' ? '5,5' : 'none',
        };
    }
  };

  return (
    <>
      <defs>
        {/* グラデーション定義 */}
        <linearGradient id="gradient-default" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="gradient-dark" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        {/* ... 他のテーマのグラデーション定義 */}

        {/* 二重線のフィルター */}
        <filter id="double-line" x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology operator="dilate" radius="1" />
          <feComposite in="SourceGraphic" />
        </filter>

        {/* 波線のフィルター */}
        <filter id="wavy-line">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2" />
        </filter>

        {/* 線の太さの変化のフィルター */}
        <filter id="varying-width">
          <feMorphology operator="dilate" radius="0.5">
            <animate
              attributeName="radius"
              values="0.5;2;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </feMorphology>
        </filter>
      </defs>

      <path
        id={id}
        style={getLineStyle()}
        className={`react-flow__edge-path ${data?.animated ? 'animated' : ''}`}
        d={getPath()}
      />
    </>
  );
};

export default CustomEdge;
