import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  onComplete?: () => void;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  text, 
  onComplete 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <span className="text-white">{displayText}</span>;
};
