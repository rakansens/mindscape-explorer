export type LayoutType = 'layered' | 'force' | 'tree' | 'circle' | 'orthogonal' | 'horizontal' | 'radial';

export interface LayoutConfig {
  type: LayoutType;
  direction?: 'TB' | 'LR' | 'RL';
  nodeSpacing?: number;
  rankSpacing?: number;
  isCompact: boolean;
}