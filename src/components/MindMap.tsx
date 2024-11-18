import React, { useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Edge,
  Connection,
} from 'reactflow';
import { useMindMapStore } from '../store/mindMapStore';
import { useLayoutStore } from '../store/layoutStore';
import { useFileStore } from '../store/fileStore';
import { useViewStore } from '../store/viewStore';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import 'reactflow/dist/style.css';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export const MindMap = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, updateNodes, updateEdges } = useMindMapStore();
  const { layout, applyLayout } = useLayoutStore();
  const { activeFileId, items } = useFileStore();
  const { theme, showMinimap } = useViewStore();

  const applyLayoutWithFit = (currentNodes: any[], currentEdges: any[]) => {
    try {
      const { nodes: layoutedNodes, edges: layoutedEdges } = applyLayout(
        currentNodes,
        currentEdges,
        window.innerWidth,
        window.innerHeight
      );

      if (layoutedNodes && layoutedNodes.length > 0) {
        // 親ノード（id: '1'）を中央に配置
        const rootNode = layoutedNodes.find(node => node.id === '1');
        if (rootNode) {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const offsetX = centerX - rootNode.position.x;
          const offsetY = centerY - rootNode.position.y;

          // すべてのノードを調整して親ノードが中央に来るようにする
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
  };

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
        fitViewOptions={{
          padding: 0.3,
          duration: 800,
          maxZoom: 1,
          minZoom: 0.1,
          includeHiddenNodes: false
        }}
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
    </div>
  );
};