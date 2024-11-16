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
import { applyForceLayout } from '../utils/forceLayout';
import { getLayoutedElements } from '../utils/layoutUtils';
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
  const simulationRef = useRef<any>(null);

  useEffect(() => {
    if (activeFileId) {
      const activeFile = items.find(item => item.id === activeFileId && item.type === 'file');
      if (activeFile && 'data' in activeFile) {
        // ファイルが読み込まれたときに階層レイアウトを適用
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          activeFile.data.nodes,
          activeFile.data.edges,
          {
            direction: 'TB',
            nodeWidth: 200,
            nodeHeight: 100,
            rankSpacing: 200,
            nodeSpacing: 100,
          }
        );
        updateNodes(layoutedNodes);
        updateEdges(layoutedEdges);
      }
    }
  }, [activeFileId]);

  useEffect(() => {
    if (nodes.length > 0 && !simulationRef.current) {
      simulationRef.current = applyForceLayout(
        nodes,
        edges,
        window.innerWidth,
        window.innerHeight,
        updateNodes
      );
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [nodes.length, edges.length]);

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
            className="!absolute !right-4 !bottom-20 bg-background/80 backdrop-blur-sm rounded-xl border border-border"
            maskColor="rgba(0, 0, 0, 0.2)"
            nodeColor={(node) => {
              return theme === 'dark' ? '#ffffff' : '#1a1a1a';
            }}
            nodeStrokeColor={(node) => {
              return theme === 'dark' ? '#333333' : '#e5e5e5';
            }}
          />
        )}
      </ReactFlow>
      <ViewControls />
    </div>
  );
};
