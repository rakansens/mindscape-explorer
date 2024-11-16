import { cn } from '../../utils/cn';

export const getNodeThemeStyle = (level: number, theme: string): string => {
  const baseStyle = "relative min-w-[120px] max-w-[300px] rounded-xl shadow-lg";
  
  switch(theme) {
    case 'dark':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-indigo-400 to-indigo-500 text-white font-bold text-lg shadow-lg' 
          : level === 1
          ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-slate-100'
          : 'bg-gradient-to-br from-slate-600 to-slate-700 text-slate-100'
      );
    case 'purple':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-purple-400 to-purple-500 text-white font-bold text-lg shadow-lg' 
          : level === 1
          ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white'
          : 'bg-gradient-to-br from-purple-700 to-purple-800 text-white'
      );
    case 'blue':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold text-lg shadow-lg' 
          : level === 1
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
          : 'bg-gradient-to-br from-blue-700 to-blue-800 text-white'
      );
    case 'sepia':
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white font-bold text-lg shadow-lg' 
          : level === 1
          ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
          : 'bg-gradient-to-br from-amber-700 to-amber-800 text-white'
      );
    case 'mint':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white font-bold text-lg shadow-lg'
          : level === 1
          ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white'
          : 'bg-gradient-to-br from-emerald-700 to-teal-700 text-white'
      );
    case 'rose':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-rose-400 to-pink-400 text-white font-bold text-lg shadow-lg'
          : level === 1
          ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white'
          : 'bg-gradient-to-br from-rose-600 to-pink-600 text-white'
      );
    case 'sunset':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white font-bold text-lg shadow-lg'
          : level === 1
          ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
          : 'bg-gradient-to-br from-orange-600 to-red-600 text-white'
      );
    case 'ocean':
      return cn(
        baseStyle,
        level === 0
          ? 'bg-gradient-to-br from-cyan-400 to-blue-400 text-white font-bold text-lg shadow-lg'
          : level === 1
          ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white'
          : 'bg-gradient-to-br from-cyan-700 to-blue-700 text-white'
      );
    default: // light
      return cn(
        baseStyle, 
        level === 0 
          ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold text-lg shadow-lg' 
          : level === 1
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
          : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
      );
  }
};