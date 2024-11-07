export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ANIMATION_DURATION = 300;

export const getNodeAnimationClass = (
  isAppearing: boolean,
  isRemoving: boolean,
  isGenerating: boolean
) => {
  if (isAppearing) return 'animate-fadeIn';
  if (isRemoving) return 'animate-fadeOut';
  if (isGenerating) return 'animate-pulse scale-105';
  return '';
};