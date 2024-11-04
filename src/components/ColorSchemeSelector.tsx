import React from 'react';
import { useColorSchemeStore } from '../store/colorSchemeStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ColorSchemeSelector = () => {
  const { predefinedSchemes, setColorScheme } = useColorSchemeStore();

  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={(value) => {
          setColorScheme(predefinedSchemes[value]);
        }}
        defaultValue="default"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="カラースキーム" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">デフォルト</SelectItem>
          <SelectItem value="nature">ネイチャー</SelectItem>
          <SelectItem value="sunset">サンセット</SelectItem>
          <SelectItem value="ocean">オーシャン</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};