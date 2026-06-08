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
      <details className="group/checklist" open>
        <summary className="flex items-center justify-between mb-2 cursor-pointer select-none marker:content-none hover:bg-white/[0.04] rounded-lg px-2 py-1.5 -mx-2 transition-colors">
          <span className="text-xs font-semibold text-white/55 uppercase tracking-wide">
            配色清单
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-white/35 group-hover/checklist:text-white/50 transition-colors">
            {usedColors.length} 色
            <svg
              className="size-3.5 transition-transform group-open/checklist:rotate-180"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </summary>

        <div className="rounded-xl bg-white/[0.05] backdrop-blur-xl ring-1 ring-white/[0.12] overflow-hidden">
          <div className="grid grid-cols-[40px_28px_1fr_auto] gap-2 px-3 py-2 bg-white/[0.08] text-[10px] font-medium text-white/45 uppercase tracking-wide">
            <span>色号</span>
            <span />
            <span>颜色</span>
            <span className="text-right">数量</span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {usedColors.map((entry) => {
              const code = entry.bead.codes[brandId];
              return (
                <div
                  key={entry.bead.id}
                  className="grid grid-cols-[40px_28px_1fr_auto] gap-2 px-3 py-2 items-center hover:bg-white/[0.04] transition-colors"
                >
                  <span className="text-xs font-bold text-[#7B8AFF] tabular-nums">
                    {code}
                  </span>
                  <span
                    className="size-6 rounded shrink-0 ring-1 ring-white/10"
                    style={{ backgroundColor: entry.bead.hex }}
                  />
                  <span className="text-sm text-white/50 truncate">
                    {entry.bead.nameZh}
                  </span>
                  <span className="text-xs font-medium text-white/45 tabular-nums text-right">
                    {formatNumber(entry.count)} 颗
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </details>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.06] backdrop-blur-xl p-3 text-center ring-1 ring-white/[0.12]">
      <p className="text-lg font-semibold text-white tabular-nums tracking-tight">
        {value}
      </p>
      <p className="text-[10px] font-medium text-white/45 uppercase tracking-wide mt-0.5">
        {label}
      </p>
    </div>
  );
}
