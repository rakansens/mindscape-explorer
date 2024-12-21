import React, { memo, useMemo } from 'react';
import { EdgeProps, getBezierPath, getSmoothStepPath, Position } from 'reactflow';
import { useViewStore } from '../store/viewStore';

interface CustomEdgeProps extends EdgeProps {
  data?: {
    animated?: boolean;
  };
  sourceHandle?: string;
  targetHandle?: string;
}

const CustomEdge = memo(({
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
}: CustomEdgeProps) => {
  const { edgeStyle, lineStyle, theme } = useViewStore();

  const getEdgeColor = useMemo(() => {
    switch(theme) {
      case 'dark':
        return 'rgba(255, 255, 255, 0.7)';
      case 'blue':
        return 'rgba(37, 99, 235, 0.7)';
      case 'purple':
        return 'rgba(147, 51, 234, 0.7)';
      case 'sepia':
        return 'rgba(180, 83, 9, 0.7)';
      case 'mint':
        return 'rgba(16, 185, 129, 0.7)';
      case 'rose':
        return 'rgba(244, 63, 94, 0.7)';
      case 'sunset':
        return 'rgba(234, 88, 12, 0.7)';
      case 'ocean':
        return 'rgba(14, 165, 233, 0.7)';
      default:
        return 'rgba(59, 130, 246, 0.7)';
    }
  }, [theme]);

  const { sourcePos, targetPos } = useMemo(() => {
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
  }, [sourceX, sourceY, targetX, targetY, sourceHandle, targetHandle]);

  const path = useMemo(() => {
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
        return getBezierPath({
          ...params,
          curvature: 0.3,
        })[0];
      case 'step':
        return getSmoothStepPath({
          ...params,
          borderRadius: 0,
          offset: 25,
        })[0];
      case 'smoothstep':
        return getSmoothStepPath({
          ...params,
          borderRadius: 15,
          offset: 25,
        })[0];
      case 'straight':
        return `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
      default:
        return getBezierPath({
          ...params,
          curvature: 0.3,
        })[0];
    }
  }, [sourceX, sourceY, targetX, targetY, sourcePos, targetPos, edgeStyle]);

  const lineStyleProps = useMemo(() => {
    const baseWidth = 2;
    const color = getEdgeColor;

    switch (lineStyle) {
      case 'double':
        return {
          strokeWidth: baseWidth,
          stroke: color,
          filter: 'url(#double-line)',
          opacity: 1,
        };
      case 'wavy':
        return {
          strokeWidth: baseWidth,
          stroke: color,
          filter: 'url(#wavy-line)',
          opacity: 1,
        };
      case 'gradient':
        return {
          strokeWidth: baseWidth,
          stroke: color,
          opacity: 1,
        };
      case 'varying':
        return {
          strokeWidth: baseWidth,
          stroke: color,
          filter: 'url(#varying-width)',
          opacity: 1,
        };
      default:
        return {
          strokeWidth: baseWidth,
          stroke: color,
          strokeDasharray: lineStyle === 'dashed' ? '5,5' : 'none',
          opacity: 1,
        };
    }
  }, [lineStyle, getEdgeColor]);

  return (
    <>
      <defs>
        <filter id="double-line" x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology operator="dilate" radius="1" />
          <feComposite in="SourceGraphic" />
        </filter>

        <filter id="wavy-line">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2" />
        </filter>

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
        style={lineStyleProps}
        className={`react-flow__edge-path ${data?.animated ? 'animated' : ''}`}
        d={path}
      />
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';

export default CustomEdge;