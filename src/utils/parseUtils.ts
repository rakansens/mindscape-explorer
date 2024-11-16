import { TopicTree } from '../types/openai';
import { HierarchyItem } from '../types/common';

export const parseTopicTree = (response: TopicTree): HierarchyItem[] => {
  const convertToHierarchy = (item: TopicTree, level: number = 0): HierarchyItem => {
    return {
      level,
      text: item.label,
      children: item.children?.map(child => convertToHierarchy(child, level + 1)) || []
    };
  };

  // Convert children of the root node
  return response.children?.map(child => convertToHierarchy(child, 0)) || [];
};