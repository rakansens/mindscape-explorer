import React from 'react';

export const LoadingAnimation = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="animate-pulse flex space-x-1">
      <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animation-delay-200"></div>
      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animation-delay-400"></div>
    </div>
  </div>
); 