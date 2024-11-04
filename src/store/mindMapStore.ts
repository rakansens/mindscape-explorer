import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (parentNode: Node, label: string) => Node;
  updateNodeText: (id: string, text: string) => void;
  selectNode: (id: string) => void;
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Main Topic' },
    position: { x: 0, y: 0 },
  },
];

export const useMindMapStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (parentNode: Node, label: string) => {
    const newNode: Node = {
      id: uuidv4(),
      type: 'custom',
      data: { label },
      position: {
        x: parentNode.position.x + 250,
        y: parentNode.position.y,
      },
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: addEdge(
        {
          id: uuidv4(),
          source: parentNode.id,
          target: newNode.id,
          type: 'custom',
        },
        get().edges
      ),
    });

    return newNode;
  },
  updateNodeText: (id: string, text: string) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: text } } : node
      ),
    });
  },
  selectNode: (id: string) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, selected: true } }
          : { ...node, data: { ...node.data, selected: false } }
      ),
    });
  },
}));