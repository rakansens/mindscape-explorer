import React, { useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
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

  // レイアウト変更時の処理を最適化
  useEffect(() => {
    if (nodes.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = applyLayout(
        nodes,
        edges,
        window.innerWidth,
        window.innerHeight
      );
      
      // ノードの位置が実際に変更されたかチェック
      const positionsChanged = layoutedNodes.some((newNode, index) => {
        const oldNode = nodes[index];
        return (
          Math.abs(newNode.position.x - oldNode.position.x) > 1 ||
          Math.abs(newNode.position.y - oldNode.position.y) > 1
        );
      });

      if (positionsChanged) {
        // エッジの接続情報を保持したまま更新
        const updatedEdges = layoutedEdges.map(edge => ({
          ...edge,
          sourceHandle: edges.find(e => e.id === edge.id)?.sourceHandle,
          targetHandle: edges.find(e => e.id === edge.id)?.targetHandle,
        }));

        updateNodes(layoutedNodes);
        updateEdges(updatedEdges);
      }
    }
  }, [layout.type, layout.direction, layout.nodeSpacing, layout.rankSpacing]);

  // ファイル変更時の処理
  useEffect(() => {
    if (activeFileId) {
      const activeFile = items.find(item => item.id === activeFileId && item.type === 'file');
      if (activeFile && 'data' in activeFile) {
        const { nodes: layoutedNodes, edges: layoutedEdges } = applyLayout(
          activeFile.data.nodes,
          activeFile.data.edges,
          window.innerWidth,
          window.innerHeight
        );
        updateNodes(layoutedNodes);
        updateEdges(layoutedEdges);
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