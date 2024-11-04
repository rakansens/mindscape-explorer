import React from 'react';
import ReactFlow, { 
  Background,
  Controls,
  ReactFlowProvider 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useMindMapStore } from '../store/mindMapStore';
import CustomNode from '../components/CustomNode';
import CustomEdge from '../components/CustomEdge';
import { Toolbar } from '../components/Toolbar';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const MindMap = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useMindMapStore();

  return (
    <div className="w-screen h-screen bg-gray-50">
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
      <Toolbar />
    </div>
  );
};

const Index = () => (
  <ReactFlowProvider>
    <MindMap />
  </ReactFlowProvider>
);

export default Index;