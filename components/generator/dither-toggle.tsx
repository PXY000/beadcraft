"use client";

import { Blend } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DitherToggleProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function DitherToggle({ enabled, onToggle, disabled }: DitherToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Blend className="size-3.5 text-white/40" />
        <span className="text-xs font-medium text-white/40 uppercase tracking-wide">
          颜色抖动
        </span>
        <Tooltip>
          <TooltipTrigger>
            <span className="size-4 rounded-full bg-white/[0.10] text-[9px] font-bold text-white/40 flex items-center justify-center hover:bg-white/[0.16] transition-colors cursor-default">
              ?
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[220px] text-xs">
            Floyd-Steinberg误差扩散，用相邻像素补偿颜色，大幅减少色带和细节丢失。建议保持开启。
          </TooltipContent>
        </Tooltip>
      </div>
      <button
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          enabled ? "bg-[#5E6AD2]" : "bg-white/[0.15]"
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
