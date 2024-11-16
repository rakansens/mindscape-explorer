import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/Tooltip";

interface ThemeMenuProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export const ThemeMenu = ({ theme, setTheme }: ThemeMenuProps) => {
  const themeSwatches = [
    { id: 'light', colors: ['bg-white', 'bg-blue-500'], label: 'ライトモード' },
    { id: 'dark', colors: ['bg-[#1A1F2C]', 'bg-gray-700'], label: 'ダークモード' },
    { id: 'blue', colors: ['bg-blue-100', 'bg-blue-600'], label: 'ブルーテーマ' },
    { id: 'purple', colors: ['bg-purple-100', 'bg-purple-600'], label: 'パープルテーマ' },
    { id: 'sepia', colors: ['bg-amber-50', 'bg-amber-700'], label: 'セピアテーマ' },
    { id: 'mint', colors: ['bg-green-50', 'bg-green-500'], label: 'ミントテーマ' },
    { id: 'rose', colors: ['bg-pink-50', 'bg-pink-400'], label: 'ローズテーマ' },
    { id: 'sunset', colors: ['bg-orange-50', 'bg-orange-500'], label: 'サンセットテーマ' },
    { id: 'ocean', colors: ['bg-cyan-50', 'bg-cyan-500'], label: 'オーシャンテーマ' }
  ];

  return (
    <DropdownMenu>
      <Tooltip text="テーマを変更" position="top">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
          >
            <div className="w-5 h-5 rounded-full border-2 border-current overflow-hidden">
              <div className={`w-full h-1/2 ${themeSwatches.find(t => t.id === theme)?.colors[0] || 'bg-white'}`} />
              <div className={`w-full h-1/2 ${themeSwatches.find(t => t.id === theme)?.colors[1] || 'bg-blue-500'}`} />
            </div>
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent align="end" className="p-2 grid grid-cols-1 gap-2 min-w-[150px]">
        {themeSwatches.map((themeSwatch) => (
          <button
            key={themeSwatch.id}
            onClick={() => setTheme(themeSwatch.id)}
            className={`
              flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors
              ${theme === themeSwatch.id ? 'ring-2 ring-primary' : ''}
            `}
          >
            <div className="w-6 h-6 rounded-full border border-border overflow-hidden">
              <div className={`w-full h-1/2 ${themeSwatch.colors[0]}`} />
              <div className={`w-full h-1/2 ${themeSwatch.colors[1]}`} />
            </div>
            <span className="text-sm">{themeSwatch.label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};