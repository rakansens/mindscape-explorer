import React, { useEffect, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  applyNodeChanges, 
  applyEdgeChanges,
} from 'reactflow';
import { useMindMapStore } from '../store/mindMapStore';
import { useFileStore } from '../store/fileStore';
import { useViewStore } from '../store/viewStore';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import { calculateElkLayout } from '../utils/elkLayout';
import { ViewControls } from './ViewControls';
import 'reactflow/dist/style.css';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export const MindMap = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, updateNodes, updateEdges } = useMindMapStore();
  const { activeFileId, items } = useFileStore();
  const { theme, showMinimap } = useViewStore();

  useEffect(() => {
    if (activeFileId) {
      const activeFile = items.find(item => item.id === activeFileId && item.type === 'file');
      if (activeFile && 'data' in activeFile) {
        // ELKレイアウトを適用
        calculateElkLayout(activeFile.data.nodes, activeFile.data.edges)
          .then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
            updateNodes(layoutedNodes);
            updateEdges(layoutedEdges);
          });
      }
    }
  }, [activeFileId]);

  return (
    <div className={`w-full h-full ${theme} relative`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'custom',
          animated: true,
        }}
        fitView
        className={`bg-background text-foreground`}
      >
        <Background className="bg-background" />
        <Controls className="bg-background text-foreground border-border" />
        {showMinimap && (
          <MiniMap
            className="bg-background/80 backdrop-blur-sm rounded-xl border border-border"
            maskColor="rgba(0, 0, 0, 0.2)"
            nodeColor={(node) => {
              return theme === 'dark' ? '#ffffff' : '#1a1a1a';
            }}
            nodeStrokeColor={(node) => {
              return theme === 'dark' ? '#333333' : '#e5e5e5';
            }}
            style={{
              right: 24,
              bottom: 24,
            }}
          />
        )}
      </ReactFlow>
      <ViewControls />
    </div>
  );
};