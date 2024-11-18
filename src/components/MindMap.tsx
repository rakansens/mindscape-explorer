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
  const { theme, showMinimap, instance } = useViewStore();

  const centerParentNode = () => {
    if (instance && nodes.length > 0) {
      const parentNode = nodes.find(node => node.id === "1");
      if (parentNode) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const zoom = Math.min(
          viewportWidth / (200 * 2),
          viewportHeight / (100 * 2)
        );
        
        instance.setCenter(
          viewportWidth / 2,
          viewportHeight / 2,
          { 
            zoom: Math.min(1, zoom),
            duration: 800
          }
        );
      } else {
        // 親ノードが見つからない場合は全体をフィット
        instance.fitView({ duration: 800 });
      }
    }
  };

  useEffect(() => {
    if (nodes.length > 0) {
      try {
        const { nodes: layoutedNodes, edges: layoutedEdges } = applyLayout(
          nodes,
          edges,
          window.innerWidth,
          window.innerHeight
        );

        if (layoutedNodes && layoutedNodes.length > 0) {
          const updatedEdges = edges.map(originalEdge => {
            const layoutedEdge = layoutedEdges.find(e => e.id === originalEdge.id);
            if (!layoutedEdge) return originalEdge;
            
            return {
              ...originalEdge,
              source: layoutedEdge.source,
              target: layoutedEdge.target,
              sourceHandle: originalEdge.sourceHandle,
              targetHandle: originalEdge.targetHandle,
            };
          });

          updateNodes(layoutedNodes);
          updateEdges(updatedEdges);
          
          // レイアウト適用後に中央配置を実行（遅延を長めに設定）
          setTimeout(centerParentNode, 300);
        }
      } catch (error) {
        console.error('Layout calculation error:', error);
      }
    }
  }, [layout.type, layout.direction, layout.nodeSpacing, layout.rankSpacing]);

  useEffect(() => {
    if (activeFileId) {
      const activeFile = items.find(item => item.id === activeFileId && item.type === 'file');
      if (activeFile && 'data' in activeFile) {
        try {
          const { nodes: layoutedNodes, edges: layoutedEdges } = applyLayout(
            activeFile.data.nodes,
            activeFile.data.edges,
            window.innerWidth,
            window.innerHeight
          );

          if (layoutedNodes && layoutedNodes.length > 0) {
            const updatedEdges = layoutedEdges.map(edge => ({
              ...edge,
              sourceHandle: edge.sourceHandle,
              targetHandle: edge.targetHandle,
              type: 'custom',
              animated: true,
              style: edge.style || {},
            }));

            updateNodes(layoutedNodes);
            updateEdges(updatedEdges);
            
            // ファイル読み込み後に中央配置を実行（遅延を長めに設定）
            setTimeout(centerParentNode, 300);
          }
        } catch (error) {
          console.error('File layout calculation error:', error);
        }
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