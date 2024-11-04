import { create } from 'zustand';

type ColorScheme = {
  primary: string;
  secondary: string;
  accent: string;
};

type ColorSchemeStore = {
  currentScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  predefinedSchemes: Record<string, ColorScheme>;
};

export const useColorSchemeStore = create<ColorSchemeStore>((set) => ({
  currentScheme: {
    primary: 'bg-blue-500',
    secondary: 'bg-purple-500',
    accent: 'bg-pink-500',
  },
  predefinedSchemes: {
    default: {
      primary: 'bg-blue-500',
      secondary: 'bg-purple-500',
      accent: 'bg-pink-500',
    },
    nature: {
      primary: 'bg-green-500',
      secondary: 'bg-emerald-500',
      accent: 'bg-teal-500',
    },
    sunset: {
      primary: 'bg-orange-500',
      secondary: 'bg-red-500',
      accent: 'bg-yellow-500',
    },
    ocean: {
      primary: 'bg-cyan-500',
      secondary: 'bg-blue-500',
      accent: 'bg-indigo-500',
    },
  },
  setColorScheme: (scheme) => set({ currentScheme: scheme }),
}));