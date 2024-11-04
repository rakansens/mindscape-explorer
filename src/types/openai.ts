export interface TopicTree {
  label: string;
  children: TopicTree[];
  description?: string;
}

export interface GenerateOptions {
  mode?: 'what' | 'why' | 'how' | 'which' | 'quick' | 'detailed';
  whatType?: 'simple' | 'detailed';
  whyType?: 'simple' | 'detailed';
  howType?: 'simple' | 'detailed';
  whichType?: 'simple' | 'detailed';
  quickType?: 'simple' | 'detailed';
  style?: string;
  structure?: {
    level1: number;
    level2: number;
    level3: number;
  };
  context?: string; // Added context property
}