import { LayoutType } from '../types/mindMapTypes';
import { HORIZONTAL_SPACING, VERTICAL_SPACING } from '../constants/layoutConstants';

export const createLayoutSlice = (set: any, get: any) => ({
  setLayout: (layout: LayoutType) => {
    set({ layout });
    get().calculateLayout();
  },

  calculateLayout: () => {
    const { nodes, edges, layout } = get();
    const spacing = {
      h: HORIZONTAL_SPACING[layout],
      v: VERTICAL_SPACING[layout],
    };

    // ノードの階層とグループを計算
    const nodeHierarchy = new Map<string, number>();
    const nodeGroups = new Map<string, string>();
    const childrenCount = new Map<string, number>();

    // 階層とグループを計算
    const calculateHierarchy = (nodeId: string, level: number = 0, parentId: string | null = null) => {
      nodeHierarchy.set(nodeId, level);
      if (parentId) nodeGroups.set(nodeId, parentId);

      const children = edges
        .filter(edge => edge.source === nodeId)
        .map(edge => edge.target);

      childrenCount.set(nodeId, children.length);
      children.forEach(childId => calculateHierarchy(childId, level + 1, nodeId));
    };

    // ルートノードを見つけて階層計算を開始
    const rootNode = nodes.find(node => !edges.some(edge => edge.target === node.id));
    if (rootNode) {
      calculateHierarchy(rootNode.id);
    }

    // 中心位置を計算
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 3;

    // ルートノードを配置
    if (rootNode) {
      get().updateNodePosition(rootNode.id, { x: centerX, y: centerY });
    }

    // 各レベルノードを配置
    const maxLevel = Math.max(...Array.from(nodeHierarchy.values()));
    
    for (let level = 1; level <= maxLevel; level++) {
      const levelNodes = nodes.filter(node => nodeHierarchy.get(node.id) === level);
      
      levelNodes.forEach(node => {
        const parentId = nodeGroups.get(node.id);
        if (!parentId) return;

        const parent = nodes.find(n => n.id === parentId);
        if (!parent) return;

        const siblings = edges
          .filter(edge => edge.source === parentId)
          .map(edge => edge.target);
        
        const nodeIndex = siblings.indexOf(node.id);
        const totalSiblings = siblings.length;

        let newPosition;
        const levelMultiplier = Math.sqrt(level); // 階層が深くなるほど距離を調整

        switch (layout) {
          case 'vertical':
            const xOffset = ((nodeIndex - (totalSiblings - 1) / 2) * spacing.h.sub * 1.2);
            newPosition = {
              x: parent.position.x + xOffset,
              y: parent.position.y + (spacing.v.main * levelMultiplier),
            };
            break;

          case 'radial':
            const angleStep = (2 * Math.PI) / totalSiblings;
            const baseAngle = -Math.PI / 2; // 上方向から開始
            const angle = baseAngle + (nodeIndex * angleStep);
            const radius = level * spacing.h.main;
            newPosition = {
              x: centerX + Math.cos(angle) * radius,
              y: centerY + Math.sin(angle) * radius,
            };
            break;

          default: // horizontal
            const horizontalOffset = spacing.h.main * levelMultiplier;
            const verticalOffset = ((nodeIndex - (totalSiblings - 1) / 2) * spacing.v.sub * 1.2);
            newPosition = {
              x: parent.position.x + horizontalOffset,
              y: parent.position.y + verticalOffset,
            };
        }

        get().updateNodePosition(node.id, newPosition);
      });
    }
  },
});
