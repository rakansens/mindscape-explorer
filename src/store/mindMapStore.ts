import { create } from 'zustand';
import { Connection, Edge, Node, applyNodeChanges, applyEdgeChanges, Position, CoordinateExtent } from 'reactflow';
import { NodeData } from '../types/node';
import { ModelConfig } from '../types/models';
import { addNodeWithPosition, updateNodeWithData } from '../utils/nodeOperations';
import { createEdge } from '../utils/edgeOperations';
import * as fileOps from './mindmap/fileOperations';

interface MindMapState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  modelConfig?: ModelConfig;
  selectedNodeId: string | null;
}

interface MindMapActions {
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodes: (nodes: Node<NodeData>[]) => void;
  updateEdges: (edges: Edge[]) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  updateNodeText: (id: string, text: string) => void;
  addNode: (parentNode: Node, label: string, position: { x: number; y: number }) => Node;
  selectNode: (id: string) => void;
  saveMap: () => void;
  loadMap: () => void;
  exportAsImage: () => Promise<void>;
  exportAsPDF: () => Promise<void>;
  exportAsJSON: () => void;
  importFromJSON: (jsonString: string) => void;
  setModelConfig: (config: ModelConfig) => void;
  groupSelectedNodes: (selectedNodes: Node[], padding: number) => void;
}

type MindMapStore = MindMapState & MindMapActions;

export const useMindMapStore = create<MindMapStore>((set, get) => ({
  nodes: [],
  edges: [],
  modelConfig: undefined,
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes)
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges)
    }));
  },

  onConnect: (connection: Connection) => {
    if (!connection.source || !connection.target) return;
    
    set((state) => ({
      edges: [
        ...state.edges,
        createEdge(
          connection.source,
          connection.target,
          connection.sourceHandle,
          connection.targetHandle
        )
      ]
    }));
  },

  updateNodes: (nodes) => set({ nodes }),
  updateEdges: (edges) => set({ edges }),

  updateNode: (id, data) => {
    set((state) => ({
      nodes: updateNodeWithData(state.nodes, id, data)
    }));
  },

  updateNodeText: (id, text) => {
    set((state) => ({
      nodes: updateNodeWithData(state.nodes, id, { label: text })
    }));
  },

  addNode: (parentNode, label, position) => {
    let newNode;
    set((state) => {
      newNode = addNodeWithPosition(state.nodes, parentNode, label, position);
      return {
        nodes: [...state.nodes, newNode],
        edges: [
          ...state.edges,
          createEdge(parentNode.id, newNode.id)
        ]
      };
    });
    return newNode!;
  },

  selectNode: (id) => {
    set((state) => ({
      selectedNodeId: id,
      nodes: state.nodes.map((node) => ({
        ...node,
        data: { ...node.data, selected: node.id === id },
      })),
    }));
  },

  saveMap: () => {
    const state = get();
    fileOps.saveMap(state);
  },

  loadMap: () => {
    const result = fileOps.loadMap();
    if (result) {
      set(result);
    }
  },

  exportAsImage: async () => {
    await fileOps.exportAsImage();
  },

  exportAsPDF: async () => {
    await fileOps.exportAsPDF();
  },

  exportAsJSON: () => {
    const state = get();
    fileOps.exportAsJSON(state);
  },

  importFromJSON: (jsonString) => {
    const result = fileOps.importFromJSON(jsonString);
    if (result) {
      set(result);
    }
  },

  setModelConfig: (config) => set({ modelConfig: config }),

  groupSelectedNodes: (selectedNodes, padding) => {
    if (selectedNodes.length < 2) return;

    const minX = Math.min(...selectedNodes.map(node => node.position.x));
    const minY = Math.min(...selectedNodes.map(node => node.position.y));
    const maxX = Math.max(...selectedNodes.map(node => node.position.x + (node.width || 0)));
    const maxY = Math.max(...selectedNodes.map(node => node.position.y + (node.height || 0)));

    const groupNode: Node<NodeData> = {
      id: `group-${Date.now()}`,
      type: 'group',
      position: { x: minX - padding, y: minY - padding },
      style: {
        width: maxX - minX + padding * 2,
        height: maxY - minY + padding * 2,
        backgroundColor: 'rgba(240, 240, 240, 0.1)',
        border: '1px dashed #ccc',
        borderRadius: '8px',
      },
      data: { label: 'Group' },
    };

    const updatedNodes = selectedNodes.map(node => ({
      ...node,
      parentNode: groupNode.id,
      extent: 'parent' as 'parent' | CoordinateExtent,
      position: {
        x: node.position.x - minX + padding,
        y: node.position.y - minY + padding,
      },
    })) as Node<NodeData>[];

    set(state => ({
      nodes: [
        ...state.nodes.filter(node => !selectedNodes.find(n => n.id === node.id)),
        groupNode,
        ...updatedNodes,
      ]
    }));
  },
}));