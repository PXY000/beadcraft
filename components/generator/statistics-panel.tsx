"use client";

import { useMemo } from "react";
import type { BlueprintStatistics, BrandId } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface StatisticsPanelProps {
  statistics: BlueprintStatistics | null;
  brandId: BrandId;
}

export function StatisticsPanel({ statistics, brandId }: StatisticsPanelProps) {
  const usedColors = useMemo(
    () => statistics?.beadCounts.filter((s) => s.count > 0) ?? [],
    [statistics]
  );

  if (!statistics) return null;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="拼豆总数" value={formatNumber(statistics.totalBeads)} />
        <StatCard label="使用颜色" value={`${usedColors.length} 种`} />
        <StatCard
          label="网格尺寸"
          value={`${statistics.dimensions.cols}×${statistics.dimensions.rows}`}
        />
      </div>

      {/* Shopping list with brand codes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wide">
            配色清单
          </span>
        </div>

        <div className="rounded-xl bg-[#F8F8FA] ring-1 ring-black/5 overflow-hidden">
          <div className="grid grid-cols-[40px_28px_1fr_auto] gap-2 px-3 py-2 bg-[#F0F0F4] text-[10px] font-medium text-[#9B9B9B] uppercase tracking-wide">
            <span>色号</span>
            <span />
            <span>颜色</span>
            <span className="text-right">数量</span>
          </div>

          <div className="divide-y divide-black/5">
            {usedColors.map((entry) => {
              const code = entry.bead.codes[brandId];
              return (
                <div
                  key={entry.bead.id}
                  className="grid grid-cols-[40px_28px_1fr_auto] gap-2 px-3 py-2 items-center hover:bg-white/60 transition-colors"
                >
                  {/* Brand code */}
                  <span className="text-xs font-bold text-[#5E6AD2] tabular-nums">
                    {code}
                  </span>
                  {/* Color swatch */}
                  <span
                    className="size-4 rounded shrink-0 ring-1 ring-black/10"
                    style={{ backgroundColor: entry.bead.hex }}
                  />
                  {/* Name */}
                  <span className="text-sm text-[#1A1A1A] truncate">
                    {entry.bead.nameZh}
                  </span>
                  {/* Count */}
                  <span className="text-xs font-medium text-[#6B6B6B] tabular-nums text-right">
                    {formatNumber(entry.count)} 颗
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#F8F8FA] p-3 text-center ring-1 ring-black/5">
      <p className="text-lg font-semibold text-[#1A1A1A] tabular-nums tracking-tight">
        {value}
      </p>
      <p className="text-[10px] font-medium text-[#9B9B9B] uppercase tracking-wide mt-0.5">
        {label}
      </p>
    </div>
  );
}
