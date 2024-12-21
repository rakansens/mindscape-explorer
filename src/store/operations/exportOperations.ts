import { Edge } from 'reactflow';
import { NodeData } from '../../types/node';
import { downloadJson, downloadImage } from '../../utils/fileUtils';

export const exportToJson = (nodes: NodeData[], edges: Edge[]) => {
  const data = {
    nodes,
    edges,
  };
  downloadJson(data, 'mindmap.json');
};

export const exportToImage = (element: HTMLElement) => {
  downloadImage(element, 'mindmap.png');
};
