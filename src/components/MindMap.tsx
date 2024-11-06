import React, { useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  applyNodeChanges, 
  applyEdgeChanges,
  ReactFlowProvider 
} from 'reactflow';
import { useMindMapStore } from '../store/mindMapStore';
import { useFileStore } from '../store/fileStore';
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
  const { activeFileId, items } = useFileStore();

  useEffect(() => {
    if (activeFileId) {
      const activeFile = items.find(item => item.id === activeFileId && item.type === 'file');
      if (activeFile && 'data' in activeFile) {
        updateNodes(activeFile.data.nodes);
        updateEdges(activeFile.data.edges);
      }
    }
  }, [activeFileId]);

  return (
    <div className="w-full h-full">
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
        className="bg-dot-pattern"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}; 