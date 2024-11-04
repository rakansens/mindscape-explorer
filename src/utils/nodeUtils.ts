import { useColorSchemeStore } from '../store/colorSchemeStore';

export const getNodeStyle = (level: number) => {
  const { currentScheme } = useColorSchemeStore.getState();
  
  switch (level) {
    case 0:
      return `${currentScheme.primary} hover:brightness-110`;
    case 1:
      return `${currentScheme.secondary} hover:brightness-110`;
    default:
      return `${currentScheme.accent} hover:brightness-110`;
  }
};