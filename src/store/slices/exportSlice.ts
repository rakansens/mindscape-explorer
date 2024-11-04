import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const createExportSlice = (set: any, get: any) => ({
  saveMap: () => {
    const state = {
      nodes: get().nodes,
      edges: get().edges,
      layout: get().layout,
    };
    localStorage.setItem('mindmap', JSON.stringify(state));
  },

  loadMap: () => {
    const savedData = localStorage.getItem('mindmap');
    if (savedData) {
      try {
        const state = JSON.parse(savedData);
        set({
          nodes: state.nodes,
          edges: state.edges,
          layout: state.layout,
        });
      } catch (error) {
        console.error('Failed to load mindmap:', error);
      }
    }
  },

  exportAsImage: async () => {
    const flowElement = document.querySelector('.react-flow') as HTMLElement;
    if (!flowElement) return;

    try {
      const dataUrl = await toPng(flowElement, {
        backgroundColor: '#f8fafc',
        quality: 1,
      });
      
      const link = document.createElement('a');
      link.download = `mindmap-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export as image:', error);
    }
  },

  exportAsPDF: async () => {
    const flowElement = document.querySelector('.react-flow') as HTMLElement;
    if (!flowElement) return;

    try {
      const dataUrl = await toPng(flowElement, {
        backgroundColor: '#f8fafc',
        quality: 1,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`mindmap-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Failed to export as PDF:', error);
    }
  },

  exportAsJSON: () => {
    const state = {
      nodes: get().nodes,
      edges: get().edges,
      layout: get().layout,
    };
    
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.download = `mindmap-${Date.now()}.json`;
    link.href = dataUri;
    link.click();
  },

  importFromJSON: (jsonData: string) => {
    try {
      const state = JSON.parse(jsonData);
      set({
        nodes: state.nodes,
        edges: state.edges,
        layout: state.layout,
      });
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  },
});
