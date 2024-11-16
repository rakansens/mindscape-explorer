import React, { useState } from 'react';
import { Handle, Position, Connection, HandleType } from 'reactflow';

interface NodeHandlesProps {
  id: string;
}

export const NodeHandles: React.FC<NodeHandlesProps> = ({ id }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const calculateHandlePosition = (x: number, y: number, rect: DOMRect): Position => {
    const threshold = 10;
    if (x < threshold) return Position.Left;
    if (x > rect.width - threshold) return Position.Right;
    if (y < threshold) return Position.Top;
    if (y > rect.height - threshold) return Position.Bottom;
    return Position.Right;
  };

  return (
    <div
      className="absolute inset-0"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 固定の接続点 */}
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-primary/50" id="left" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-primary/50" id="right" />
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-primary/50" id="top" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-primary/50" id="bottom" />

      {/* フローティング接続点 */}
      {isHovering && (
        <div
          className="absolute w-2 h-2 bg-primary/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        >
          <Handle
            type="source"
            position={Position.Right}
            className="w-full h-full"
            id={`floating-${mousePosition.x}-${mousePosition.y}`}
          />
        </div>
      )}
    </div>
  );
};