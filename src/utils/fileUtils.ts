import { Node } from 'reactflow';
import { generateId } from './idUtils';
import { NodeData } from '../types/node';
import { MindMapFile } from '../types/file';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const getMainNodeLabel = (): string => {
  const mainNode = document.querySelector('.react-flow__node-custom[data-id="1"]');
  return mainNode?.textContent || '新しいマインドマップ';
};

export const createNewFile = (title?: string): MindMapFile => {
  return {
    id: generateId(),
    title: title || '新しいマインドマップ',
    type: 'file',
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    data: {
      nodes: [{
        id: '1',
        type: 'custom',
        position: { x: window.innerWidth / 2 - 75, y: window.innerHeight / 3 },
        data: { 
          label: '新しいテーマ',
          selected: false,
          isGenerating: false,
          isAppearing: false
        }
      }],
      edges: []
    }
  };
};

export const downloadJson = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadImage = async (element: HTMLElement, filename: string) => {
  const canvas = await html2canvas(element);
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};

export const downloadPDF = async (element: HTMLElement, filename: string) => {
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });
  
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
};