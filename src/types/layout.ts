export type LayoutType = 'layered' | 'force' | 'tree' | 'circle' | 'orthogonal';

export interface LayoutConfig {
  type: LayoutType;
  direction?: 'TB' | 'LR';
  nodeSpacing?: number;
  rankSpacing?: number;
}