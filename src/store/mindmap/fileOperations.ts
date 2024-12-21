import { MindMapState } from './types';
import { downloadJson, downloadImage, downloadPDF } from '../../utils/fileUtils';

export const saveMap = (state: MindMapState) => {
  try {
    localStorage.setItem('mindmap', JSON.stringify({
      nodes: state.nodes,
      edges: state.edges
    }));
  } catch (error) {
    console.error('Failed to save mindmap:', error);
  }
};

export const loadMap = (): Partial<MindMapState> | null => {
  try {
    const saved = localStorage.getItem('mindmap');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load mindmap:', error);
  }
  return null;
};

export const exportAsImage = async () => {
  try {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (element) {
      await downloadImage(element, 'mindmap.png');
    }
  } catch (error) {
    console.error('Failed to export image:', error);
  }
};

export const exportAsPDF = async () => {
  try {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (element) {
      await downloadPDF(element, 'mindmap.pdf');
    }
  } catch (error) {
    console.error('Failed to export PDF:', error);
  }
};

export const exportAsJSON = (state: MindMapState) => {
  try {
    downloadJson({ nodes: state.nodes, edges: state.edges }, 'mindmap.json');
  } catch (error) {
    console.error('Failed to export JSON:', error);
  }
};

export const importFromJSON = (jsonString: string): Partial<MindMapState> | null => {
  try {
    const data = JSON.parse(jsonString);
    if (data.nodes && data.edges) {
      return { nodes: data.nodes, edges: data.edges };
    }
  } catch (error) {
    console.error('Failed to import JSON:', error);
  }
  return null;
};