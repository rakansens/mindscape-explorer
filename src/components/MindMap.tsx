import React, { useEffect, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Edge,
  Connection,
  Panel,
} from 'reactflow';
import { useMindMapStore } from '../store/mindMapStore';
import { useLayoutStore } from '../store/layoutStore';
import { useFileStore } from '../store/fileStore';
import { useViewStore } from '../store/viewStore';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import { INITIAL_NODE } from '../constants';
import { Button } from './ui/button';
import { Layout } from 'lucide-react';
import 'reactflow/dist/style.css';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const GROUP_PADDING = 30;

export const MindMap = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    updateNodes, 
    updateEdges,
    groupSelectedNodes 
  } = useMindMapStore();
  const { layout, applyLayout } = useLayoutStore();
  const { activeFileId, items } = useFileStore();
  const { theme, showMinimap } = useViewStore();

  // 初期ノードがない場合は追加
  useEffect(() => {
    if (nodes.length === 0) {
      updateNodes([INITIAL_NODE]);
    }
  }, []);

  const handleCreateGroup = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length > 1) {
      groupSelectedNodes(selectedNodes, GROUP_PADDING);
    }
  }, [nodes, groupSelectedNodes]);

  const applyLayoutWithFit = useCallback((currentNodes: any[], currentEdges: any[]) => {
    try {
      const { nodes: layoutedNodes, edges: layoutedEdges } = applyLayout(
        currentNodes,
        currentEdges,
        window.innerWidth,
        window.innerHeight
      );

      if (layoutedNodes && layoutedNodes.length > 0) {
        const rootNode = layoutedNodes.find(node => node.id === '1');
        if (rootNode) {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const offsetX = centerX - rootNode.position.x;
          const offsetY = centerY - rootNode.position.y;

          const adjustedNodes = layoutedNodes.map(node => ({
            ...node,
            position: {
              x: node.position.x + offsetX,
              y: node.position.y + offsetY,
            }
          }));

          updateNodes(adjustedNodes);
          updateEdges(layoutedEdges);
        } else {
          updateNodes(layoutedNodes);
          updateEdges(layoutedEdges);
        }
      }
    } catch (error) {
      console.error('Layout calculation error:', error);
    }
  }, [applyLayout, updateNodes, updateEdges]);

  useEffect(() => {
    if (nodes.length > 0) {
      applyLayoutWithFit(nodes, edges);
    }
  }, [layout.type, layout.direction, layout.nodeSpacing, layout.rankSpacing]);

  useEffect(() => {
    if (activeFileId) {
      const activeFile = items.find(item => item.id === activeFileId && item.type === 'file');
      if (activeFile && 'data' in activeFile) {
        applyLayoutWithFit(activeFile.data.nodes, activeFile.data.edges);
      }
    }
  }, [activeFileId, items]);

  const handleConnect = useCallback((params: Connection) => {
    onConnect({
      ...params,
      type: 'custom',
      animated: true,
      style: { stroke: theme === 'dark' ? '#ffffff' : '#000000' }
    });
  }, [onConnect, theme]);

  return (
    <div className={`w-full h-full ${theme} relative`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'custom',
          animated: true,
        }}
        fitView
        fitViewOptions={{
          padding: 0.3,
          duration: 800,
          maxZoom: 1,
          minZoom: 0.1,
          includeHiddenNodes: false
        }}
        className={`bg-background text-foreground`}
      >
        <Panel position="top-left" className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateGroup}
            className="flex items-center gap-2"
          >
            <Layout className="w-4 h-4" />
            グループ化
          </Button>
        </Panel>
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
    </div>
  );
};