import { Node, Edge, Connection, NodeChange, EdgeChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { RFState, Theme } from './types';

export const createActions = (set: any, get: () => RFState) => ({
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

  setTheme: (theme: Theme) => {
    set({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },

  toggleMinimap: () => {
    set((state: RFState) => ({ showMinimap: !state.showMinimap }));
  },

  zoomIn: () => {
    // Implemented through ReactFlow instance
    console.log('Zoom in triggered');
  },

  zoomOut: () => {
    // Implemented through ReactFlow instance
    console.log('Zoom out triggered');
  },

  fitView: () => {
    // Implemented through ReactFlow instance
    console.log('Fit view triggered');
  },

  undo: () => {
    // Implementation for undo functionality
    console.log('Undo action triggered');
  },

  exitEditMode: () => {
    set({
      nodes: get().nodes.map((node) => ({
        ...node,
        data: { ...node.data, isEditing: false }
      }))
    });
  },

  saveMap: () => {
    const state = {
      nodes: get().nodes,
      edges: get().edges,
    };
    localStorage.setItem('mindmap-state', JSON.stringify(state));
  },

  loadMap: () => {
    const savedState = localStorage.getItem('mindmap-state');
    if (savedState) {
      const { nodes, edges } = JSON.parse(savedState);
      set({ nodes, edges });
    }
  },

  exportAsImage: async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: null,
    });

    const link = document.createElement('a');
    link.download = 'mindmap.png';
    link.href = canvas.toDataURL();
    link.click();
  },

  exportAsPDF: async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('mindmap.pdf');
  },

  exportAsJSON: () => {
    const state = {
      nodes: get().nodes,
      edges: get().edges,
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap.json';
    link.click();
    URL.revokeObjectURL(url);
  },

  importFromJSON: (jsonString: string) => {
    try {
      const { nodes, edges } = JSON.parse(jsonString);
      set({ nodes, edges });
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  },
});