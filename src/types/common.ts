import { TopicTree } from './openai';

export interface HierarchyItem {
  level: number;
  text: string;
  children: HierarchyItem[];
}