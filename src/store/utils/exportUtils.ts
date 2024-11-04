import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { MindMapStore } from '../types/mindMapTypes';

export const handleExport = {
  asImage: async () => {
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

  asPDF: async () => {
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

  asJSON: (get: () => MindMapStore) => {
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

  fromJSON: (jsonString: string, set: any) => {
    try {
      const { nodes, edges } = JSON.parse(jsonString);
      set({ nodes, edges });
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  },
};