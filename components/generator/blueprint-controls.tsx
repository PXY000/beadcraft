"use client";

import { cn } from "@/lib/utils";
import type { GridOptions } from "@/lib/types";
import { Grid3X3, Hash } from "./custom-icons";

interface BlueprintControlsProps {
  options: GridOptions;
  onChange: (options: Partial<GridOptions>) => void;
  disabled?: boolean;
}

export function BlueprintControls({
  options,
  onChange,
  disabled,
}: BlueprintControlsProps) {
  return (
    <div className="space-y-3">
      <span className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wide">
        显示选项
      </span>

      <div className="space-y-2">
        <ToggleOption
          icon={<Grid3X3 />}
          label="显示网格线"
          checked={options.showGridLines}
          onChange={() => onChange({ showGridLines: !options.showGridLines })}
          disabled={disabled}
        />
        <ToggleOption
          icon={<Hash />}
          label="显示颜色编号"
          checked={options.showNumbers}
          onChange={() => onChange({ showNumbers: !options.showNumbers })}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function ToggleOption({
  icon,
  label,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onChange}
      className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-[#F0F0F4] transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-[#6B6B6B]">{icon}</span>
        <span className="text-sm text-[#1A1A1A]">{label}</span>
      </div>
      <div
        className={cn(
          "relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-[#5E6AD2]" : "bg-[#D4D4D4]"
        )}
      >
        <span
          className={cn(
            "inline-block size-3 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[14px]" : "translate-x-[2px]"
          )}
        />
      </div>
    </button>
  );
}
