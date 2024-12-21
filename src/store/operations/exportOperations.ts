import { Node, Edge } from 'reactflow';
import { NodeData } from '../../types/node';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportAsImageOperation = async () => {
  const element = document.querySelector('.react-flow') as HTMLElement;
  if (element) {
    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'mindmap.png';
    link.href = dataUrl;
    link.click();
  }
};

export const exportAsPDFOperation = async () => {
  const element = document.querySelector('.react-flow') as HTMLElement;
  if (element) {
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('mindmap.pdf');
  }
};

export const exportAsJSONOperation = (nodes: Node<NodeData>[], edges: Edge[]) => {
  const data = { nodes, edges };
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mindmap.json';
  link.click();
  URL.revokeObjectURL(url);
};