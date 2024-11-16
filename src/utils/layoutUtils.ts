import dagre from 'dagre';
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types/node';

type Direction = 'TB' | 'LR';  // TB: top-to-bottom, LR: left-to-right

interface LayoutOptions {
  direction?: Direction;
  nodeWidth?: number;
  nodeHeight?: number;
  rankSpacing?: number;  // 階層間の間隔
  nodeSpacing?: number;  // 同じ階層のノード間の間隔
}

export const getLayoutedElements = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  options: LayoutOptions = {}
) => {
  const {
    direction = 'TB',
    nodeWidth = 200,
    nodeHeight = 100,
    rankSpacing = 200,
    nodeSpacing = 100,
  } = options;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // グラフの方向を設定
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
  });

  // ノードを追加
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // エッジを追加
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // レイアウトを実行
  dagre.layout(dagreGraph);

  // 新しい位置情報でノードを更新
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
};