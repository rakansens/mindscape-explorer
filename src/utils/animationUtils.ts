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

export const animateText = async (
  text: string,
  onUpdate: (text: string) => Promise<void>,
  delay: number = 50
) => {
  let currentText = '';
  for (let i = 0; i < text.length; i++) {
    currentText += text[i];
    await onUpdate(currentText);
    await sleep(delay);
  }
  return currentText;
};
