"use client";

import { useMemo } from "react";
import type { BlueprintStatistics } from "@/lib/types";

interface ColorLegendProps {
  statistics: BlueprintStatistics | null;
}

export function ColorLegend({ statistics }: ColorLegendProps) {
  const usedColors = useMemo(
    () => statistics?.beadCounts.filter((s) => s.count > 0) ?? [],
    [statistics]
  );

  if (!statistics || usedColors.length === 0) return null;

  return (
    <details className="space-y-2 group/legend" open>
      <summary className="flex items-center gap-1.5 cursor-pointer select-none marker:content-none">
        <span className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wide">
          全部颜色（{usedColors.length} 种）
        </span>
        <svg
          className="size-3 text-[#9B9B9B] transition-transform group-open/legend:rotate-180"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {usedColors.map((entry) => (
          <div
            key={entry.bead.id}
            className="group relative flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#F8F8FA] ring-1 ring-black/5 hover:ring-black/10 transition-all cursor-default"
            title={`${entry.bead.name}: ${entry.count} 颗`}
          >
            <span
              className="size-3 rounded-full shrink-0"
              style={{ backgroundColor: entry.bead.hex }}
            />
            <span className="text-[11px] font-medium text-[#6B6B6B] group-hover:text-[#1A1A1A] transition-colors">
              {entry.bead.nameZh}
            </span>
            <span className="text-[10px] text-[#9B9B9B] tabular-nums">
              ×{entry.count}
            </span>
          </div>
        ))}
      </div>
    </details>
  );
}
