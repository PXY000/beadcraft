"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PIXEL_SIZES } from "@/lib/constants";
import { Grid3X3 } from "lucide-react";

interface PixelSizeSelectorProps {
  value: number;
  onChange: (size: number) => void;
  disabled?: boolean;
}

export function PixelSizeSelector({
  value,
  onChange,
  disabled,
}: PixelSizeSelectorProps) {
  const [customInput, setCustomInput] = useState("");
  const isPreset = PIXEL_SIZES.includes(value as never);

  // Sync custom input when value is not a preset
  useEffect(() => {
    if (!isPreset) {
      setCustomInput(String(value));
    } else {
      setCustomInput("");
    }
  }, [value, isPreset]);

  const handleCustomApply = () => {
    const n = parseInt(customInput, 10);
    if (n >= 8 && n <= 128) {
      onChange(n);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Grid3X3 className="size-3.5 text-[#6B6B6B]" />
        <span className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wide">
          网格尺寸
        </span>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5">
        {PIXEL_SIZES.map((size) => (
          <button
            key={size}
            disabled={disabled}
            onClick={() => onChange(size)}
            className={cn(
              "py-1.5 px-2.5 text-xs font-medium rounded-lg transition-all",
              value === size
                ? "bg-white text-[#1A1A1A] shadow-sm ring-1 ring-black/5"
                : "text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-white/60"
            )}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Custom size input */}
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          min={8}
          max={128}
          disabled={disabled}
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleCustomApply(); }}
          placeholder="自定义..."
          className="w-full h-7 rounded-lg border border-black/10 bg-white px-2.5 text-xs text-[#1A1A1A] placeholder:text-[#9B9B9B] focus:outline-none focus:ring-2 focus:ring-[#5E6AD2]/20 focus:border-[#5E6AD2]/30 disabled:opacity-50"
        />
        <button
          disabled={disabled || !customInput}
          onClick={handleCustomApply}
          className="shrink-0 h-7 px-2.5 rounded-lg bg-[#1A1A1A] text-white text-xs font-medium hover:bg-[#333] transition-colors disabled:opacity-30"
        >
          确定
        </button>
      </div>

      <p className="text-[10px] text-[#9B9B9B]">
        {value}×{value} = {value * value} 颗拼豆 {!isPreset && "(自定义)"}
      </p>
    </div>
  );
}
