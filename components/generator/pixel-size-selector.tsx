"use client";

import { useState, useEffect } from "react";
import { Grid3X3 } from "lucide-react";

interface PixelSizeSelectorProps {
  width: number;
  height: number;
  onChange: (width: number, height: number) => void;
  disabled?: boolean;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function PixelSizeSelector({
  width,
  height,
  onChange,
  disabled,
}: PixelSizeSelectorProps) {
  const [wInput, setWInput] = useState(String(width));
  const [hInput, setHInput] = useState(String(height));

  // Sync inputs when external width/height changes
  useEffect(() => {
    setWInput(String(width));
  }, [width]);
  useEffect(() => {
    setHInput(String(height));
  }, [height]);

  const apply = (w: number, h: number) => {
    const cw = clamp(w, 8, 128);
    const ch = clamp(h, 8, 128);
    setWInput(String(cw));
    setHInput(String(ch));
    onChange(cw, ch);
  };

  const handleWChange = (val: string) => {
    setWInput(val);
    const n = parseInt(val, 10);
    if (n >= 8 && n <= 128) {
      onChange(n, height);
    }
  };

  const handleHChange = (val: string) => {
    setHInput(val);
    const n = parseInt(val, 10);
    if (n >= 8 && n <= 128) {
      onChange(width, n);
    }
  };

  const total = width * height;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Grid3X3 className="size-3.5 text-white/40" />
        <span className="text-xs font-medium text-white/40 uppercase tracking-wide">
          网格尺寸
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Width */}
        <div className="flex-1">
          <label className="text-[10px] text-white/45 mb-1 block">宽度</label>
          <input
            type="number"
            min={8}
            max={128}
            disabled={disabled}
            value={wInput}
            onChange={(e) => handleWChange(e.target.value)}
            onBlur={() => apply(parseInt(wInput, 10) || width, height)}
            onKeyDown={(e) => { if (e.key === "Enter") apply(parseInt(wInput, 10) || width, height); }}
            className="w-full h-7 rounded-lg border border-white/[0.12] bg-white/[0.06] backdrop-blur-xl px-2.5 text-xs text-white/70 placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-[#5E6AD2]/20 focus:border-[#5E6AD2]/30 disabled:opacity-50 text-center"
          />
        </div>

        <span className="text-white/40 text-xs mt-4">×</span>

        {/* Height */}
        <div className="flex-1">
          <label className="text-[10px] text-white/45 mb-1 block">高度</label>
          <input
            type="number"
            min={8}
            max={128}
            disabled={disabled}
            value={hInput}
            onChange={(e) => handleHChange(e.target.value)}
            onBlur={() => apply(width, parseInt(hInput, 10) || height)}
            onKeyDown={(e) => { if (e.key === "Enter") apply(width, parseInt(hInput, 10) || height); }}
            className="w-full h-7 rounded-lg border border-white/[0.12] bg-white/[0.06] backdrop-blur-xl px-2.5 text-xs text-white/70 placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-[#5E6AD2]/20 focus:border-[#5E6AD2]/30 disabled:opacity-50 text-center"
          />
        </div>
      </div>

      <p className="text-[10px] text-white/45">
        {width}×{height} = {total} 颗拼豆
      </p>
    </div>
  );
}
