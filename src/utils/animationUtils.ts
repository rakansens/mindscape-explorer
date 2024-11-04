export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const animateText = async (
  text: string,
  onUpdate: (text: string) => void | Promise<void>,
  speed: number = 30
) => {
  let currentText = '';
  for (const char of text) {
    currentText += char;
    await onUpdate(currentText);
    await sleep(speed);
  }
};