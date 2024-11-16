import { cn } from '../../utils/cn';

export const getNodeThemeStyle = (level: number, theme: string): string => {
  const baseStyle = "relative min-w-[120px] max-w-[300px] rounded-xl shadow-lg";
  
  switch(theme) {
    case 'dark':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-indigo-700 to-indigo-800 text-white font-bold text-lg shadow-lg' 
          : level === 1
          ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white'
          : 'bg-gradient-to-br from-indigo-400 to-indigo-500 text-white'
      );
    case 'purple':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-purple-800 to-purple-900 text-white font-bold text-lg shadow-lg' 
          : level === 1
          ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white'
          : 'bg-gradient-to-br from-purple-400 to-purple-500 text-white'
      );
    case 'blue':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-white font-bold text-lg shadow-lg' 
          : level === 1
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
          : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white'
      );
    case 'sepia':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-amber-800 to-amber-900 text-white font-bold text-lg shadow-lg' 
          : level === 1
          ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
          : 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
      );
    case 'mint':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-emerald-800 to-emerald-900 text-white font-bold text-lg shadow-lg'
          : level === 1
          ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white'
          : 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white'
      );
    case 'rose':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-rose-800 to-pink-900 text-white font-bold text-lg shadow-lg'
          : level === 1
          ? 'bg-gradient-to-br from-rose-600 to-pink-700 text-white'
          : 'bg-gradient-to-br from-rose-400 to-pink-500 text-white'
      );
    case 'sunset':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-orange-800 to-red-900 text-white font-bold text-lg shadow-lg'
          : level === 1
          ? 'bg-gradient-to-br from-orange-600 to-red-700 text-white'
          : 'bg-gradient-to-br from-orange-400 to-red-500 text-white'
      );
    case 'ocean':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-cyan-800 to-blue-900 text-white font-bold text-lg shadow-lg'
          : level === 1
          ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white'
          : 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white'
      );
    default: // light
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-white font-bold text-lg shadow-lg' 
          : level === 1
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
          : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white'
      );
  }
};