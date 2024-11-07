import { useState, useEffect } from 'react';
import { useMindMapStore } from '../store/mindMapStore';

interface UseNodeAnimationProps {
  nodeId: string;
  text: string;
  delay?: number;
}

export const useNodeAnimation = ({ nodeId, text, delay = 50 }: UseNodeAnimationProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const { updateNode } = useMindMapStore();

  const startAnimation = async () => {
    setIsAnimating(true);
    let currentText = '';
    
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setDisplayText(currentText);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    setIsAnimating(false);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
    setDisplayText(text);
  };

  return {
    displayText,
    isAnimating,
    startAnimation,
    stopAnimation
  };
}; 