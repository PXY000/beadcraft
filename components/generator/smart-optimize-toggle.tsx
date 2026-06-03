"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SmartOptimizeToggleProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function SmartOptimizeToggle({
  enabled,
  onToggle,
  disabled,
}: SmartOptimizeToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Sparkles className="size-3.5 text-[#6B6B6B]" />
        <span className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wide">
          智能优化
        </span>
        <Tooltip>
          <TooltipTrigger>
            <span className="size-4 rounded-full bg-[#E5E3E0] text-[9px] font-bold text-[#6B6B6B] flex items-center justify-center hover:bg-[#D4D4D4] transition-colors cursor-default">
              ?
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[220px] text-xs">
            自动降低噪点并增强边缘，让照片类素材的拼豆转换效果更干净。
          </TooltipContent>
        </Tooltip>
      </div>
      <button
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          enabled ? "bg-[#5E6AD2]" : "bg-[#D4D4D4]"
        )}
      >
        <span
          className={cn(
            "inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform",
            enabled ? "translate-x-[18px]" : "translate-x-[3px]"
          )}
        />
      </button>
    </div>
  );
}
