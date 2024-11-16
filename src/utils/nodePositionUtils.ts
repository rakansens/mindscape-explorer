import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

const HORIZONTAL_SPACING = 250;  // 親ノードからの水平距離
const VERTICAL_SPACING = 100;    // 子ノード間の垂直距離

export const calculateNewNodePosition = (
  parentNode: Node<NodeData>,
  nodes: Node<NodeData>[],
  edges: Edge[]
) => {
  // 親ノードの子ノードを取得
  const childNodes = nodes.filter(node => 
    edges.some(edge => 
      edge.source === parentNode.id && 
      edge.target === node.id
    )
  );

  // 子ノードが存在しない場合は、親ノードの右側に配置
  if (childNodes.length === 0) {
    return {
      x: parentNode.position.x + HORIZONTAL_SPACING,
      y: parentNode.position.y
    };
  }

  // 子ノードのY座標を取得してソート
  const childYPositions = childNodes.map(node => node.position.y).sort((a, b) => a - b);
  
  // 最後の子ノードのY座標 + 垂直間隔
  const newY = childYPositions[childYPositions.length - 1] + VERTICAL_SPACING;

  return {
    x: parentNode.position.x + HORIZONTAL_SPACING,
    y: newY
  };
};