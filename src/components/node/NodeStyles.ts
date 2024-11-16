import { cn } from '../../utils/cn';

export const getNodeThemeStyle = (level: number, theme: string): string => {
  const baseStyle = "relative min-w-[120px] max-w-[300px] rounded-xl shadow-lg";
  
  switch(theme) {
    case 'dark':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-slate-800 to-slate-700 text-slate-100' 
          : level === 1
          ? 'bg-gradient-to-br from-slate-700 to-indigo-900 text-slate-100'
          : level === 2
          ? 'bg-gradient-to-br from-slate-700 to-purple-900 text-slate-100'
          : 'bg-gradient-to-br from-slate-700 to-blue-900 text-slate-100'
      );
    case 'purple':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white' 
          : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
      );
    case 'blue':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
          : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
      );
    case 'sepia':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-white' 
          : 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
      );
    case 'mint':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
          : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
      );
    case 'rose':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white'
          : 'bg-gradient-to-br from-rose-300 to-pink-400 text-white'
      );
    case 'sunset':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white'
          : 'bg-gradient-to-br from-orange-300 to-red-400 text-white'
      );
    case 'ocean':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
          : 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white'
      );
    default: // light
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
          : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white'
      );
  }
};