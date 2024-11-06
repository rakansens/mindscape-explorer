import React from 'react';
import { useOpenAIAuth } from '../../store/openAIAuthStore';
import { Tooltip } from '../Tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Cpu } from 'lucide-react';

export const ModelSelector = () => {
  const { model, setModel } = useOpenAIAuth();

  return (
    <Tooltip text="AIモデル選択" position="bottom">
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-purple-100/50 text-purple-500 transition-colors">
        <Cpu className="w-4 h-4" />
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="w-[180px] border-none shadow-none bg-transparent h-auto p-0 text-sm">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-3.5-turbo">
              <div className="flex flex-col">
                <span>GPT-3.5 Turbo</span>
                <span className="text-xs text-gray-500">標準性能 / 低コスト</span>
              </div>
            </SelectItem>
            <SelectItem value="gpt-4">
              <div className="flex flex-col">
                <span>GPT-4</span>
                <span className="text-xs text-gray-500">高性能 / 中コスト</span>
              </div>
            </SelectItem>
            <SelectItem value="gpt-4-turbo-preview">
              <div className="flex flex-col">
                <span>GPT-4 Turbo</span>
                <span className="text-xs text-gray-500">最高性能 / 高コスト</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Tooltip>
  );
}; 