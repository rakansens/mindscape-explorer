export type LayoutType = 'layered' | 'force' | 'tree' | 'circle' | 'orthogonal' | 'horizontal';

export interface LayoutConfig {
  type: LayoutType;
  direction?: 'TB' | 'LR' | 'RL';
  nodeSpacing?: number;
  rankSpacing?: number;
}