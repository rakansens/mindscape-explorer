import { GitBranch, ArrowRight, Grid, Waves } from 'lucide-react';
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/Tooltip";

interface EdgeStyleMenuProps {
  edgeStyle: string;
  setEdgeStyle: (style: string) => void;
  lineStyle: string;
  setLineStyle: (style: string) => void;
}

export const EdgeStyleMenu = ({ edgeStyle, setEdgeStyle, lineStyle, setLineStyle }: EdgeStyleMenuProps) => {
  const edgeStyles = [
    { id: 'bezier', label: 'なめらかな曲線', icon: Waves },
    { id: 'step', label: '直角の階段状', icon: Grid },
    { id: 'smoothstep', label: '滑らかな階段状', icon: ArrowRight },
    { id: 'straight', label: '直線', icon: GitBranch },
  ];

  const lineStyles = [
    { id: 'solid', label: '実線', icon: ArrowRight },
    { id: 'dashed', label: '破線', icon: GitBranch },
    { id: 'double', label: '二重線', icon: GitBranch },
    { id: 'wavy', label: '波線', icon: Waves },
    { id: 'gradient', label: 'グラデーション', icon: ArrowRight },
    { id: 'varying', label: '可変幅', icon: ArrowRight },
  ];

  return (
    <DropdownMenu>
      <Tooltip text="エッジスタイルを変更" position="top">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-lg hover:bg-blue-100/50 text-blue-500 transition-colors"
          >
            <GitBranch className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent align="end" className="p-2">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">線の形状</div>
        <div className="grid grid-cols-2 gap-2">
          {edgeStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setEdgeStyle(style.id)}
              className={`
                flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors
                ${edgeStyle === style.id ? 'ring-2 ring-primary bg-accent' : ''}
              `}
            >
              <style.icon className="w-4 h-4" />
              <span className="text-sm">{style.label}</span>
            </button>
          ))}
        </div>
        <div className="w-full h-px bg-border my-2" />
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">線のスタイル</div>
        <div className="grid grid-cols-2 gap-2">
          {lineStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setLineStyle(style.id)}
              className={`
                flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors
                ${lineStyle === style.id ? 'ring-2 ring-primary bg-accent' : ''}
              `}
            >
              <style.icon className="w-4 h-4" />
              <span className="text-sm">{style.label}</span>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};