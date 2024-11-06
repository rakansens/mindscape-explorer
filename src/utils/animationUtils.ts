export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const animateText = async (
  text: string,
  onUpdate: (text: string) => void,
  delay: number = 50
) => {
  let currentText = '';
  for (let i = 0; i < text.length; i++) {
    currentText += text[i];
    onUpdate(currentText);
    await sleep(delay);
  }
};