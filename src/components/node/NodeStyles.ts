import { cn } from '../../utils/cn';

export const getNodeThemeStyle = (level: number, theme: string): string => {
  const baseStyle = "relative min-w-[120px] max-w-[300px] rounded-xl shadow-lg";
  
  switch(theme) {
    case 'dark':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-slate-800 text-slate-100' 
          : 'bg-slate-700 text-slate-100'
      );
    case 'purple':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-purple-600 text-white' 
          : 'bg-purple-500 text-white'
      );
    case 'blue':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-blue-600 text-white' 
          : 'bg-blue-500 text-white'
      );
    case 'sepia':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-amber-700 text-white' 
          : 'bg-amber-600 text-white'
      );
    default: // light
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-blue-500 text-white' 
          : 'bg-blue-400 text-white'
      );
  }
};