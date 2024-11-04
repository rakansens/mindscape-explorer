import { create } from 'zustand';
import { ReactFlowInstance } from 'reactflow';
import dagre from 'dagre';

type ViewState = {
  instance: ReactFlowInstance | null;
  setInstance: (instance: ReactFlowInstance) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  autoLayout: () => void;
};

export const useViewStore = create<ViewState>((set, get) => ({
  instance: null,
  setInstance: (instance: ReactFlowInstance) => set({ instance }),
  zoomIn: () => {
    const { instance } = get();
    if (instance) {
      instance.zoomIn();
    }
  },
  zoomOut: () => {
    const { instance } = get();
    if (instance) {
      instance.zoomOut();
    }
  },
  fitView: () => {
    const { instance } = get();
    if (instance) {
      instance.fitView({
        duration: 500,
        padding: 0.5,
        minZoom: 0.5,
        maxZoom: 1.5
      });
    }
  },
  autoLayout: () => {
    const { instance } = get();
    if (!instance) return;

    const nodes = instance.getNodes();
    const edges = instance.getEdges();

    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 200 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
      g.setNode(node.id, { width: 150, height: 50 });
    });

    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = g.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 75,
          y: nodeWithPosition.y - 25,
        },
      };
    });

    instance.setNodes(layoutedNodes);
    
    setTimeout(() => {
      instance.fitView({
        duration: 500,
        padding: 0.5,
      });
    }, 50);
  },
}));