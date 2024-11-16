import React from 'react';
import ReactFlow, { 
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useMindMapStore } from '../store/mindMapStore';
import { useViewStore } from '../store/viewStore';
import CustomNode from '../components/CustomNode';
import CustomEdge from '../components/CustomEdge';
import { Toolbar } from '../components/Toolbar';
import { ViewControls } from '../components/ViewControls';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const MindMap = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useMindMapStore();
  const { setInstance } = useViewStore();
  const reactFlowInstance = useReactFlow();

  React.useEffect(() => {
    setInstance(reactFlowInstance);
  }, [reactFlowInstance, setInstance]);

  return (
    <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900">
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
        <ViewControls />
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