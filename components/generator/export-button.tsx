"use client";

import { Download, Smartphone } from "lucide-react";
import type { BlueprintGrid, BlueprintStatistics, ExportOptions, BrandId } from "@/lib/types";
import { exportBlueprintPNG, exportBlueprintPNGMobile } from "@/lib/canvas-operations/export-png";
import { cn } from "@/lib/utils";

interface ExportButtonProps {
  grid: BlueprintGrid | null;
  statistics: BlueprintStatistics | null;
  options: ExportOptions;
  brandId: BrandId;
  disabled?: boolean;
  className?: string;
}

export function ExportButton({
  grid,
  statistics,
  options,
  brandId,
  disabled,
  className,
}: ExportButtonProps) {
  const handleExport = async () => {
    if (!grid || !statistics) return;

    try {
      await exportBlueprintPNG(grid, statistics, options, brandId);
    } catch (err) {
      console.error("导出失败:", err);
    }
  };

  const handleMobileExport = async () => {
    if (!grid || !statistics) return;

    try {
      await exportBlueprintPNGMobile(grid, statistics, options, brandId);
    } catch (err) {
      console.error("手机版导出失败:", err);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <button
        onClick={handleExport}
        disabled={disabled || !grid}
        className={cn(
          "inline-flex items-center justify-center gap-2 w-full h-9 rounded-lg text-sm font-medium transition-all",
          "bg-[#1A1A1A] text-white hover:bg-[#333]",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        <Download className="size-4" />
        导出 PNG 图纸
      </button>
      <button
        onClick={handleMobileExport}
        disabled={disabled || !grid}
        className={cn(
          "inline-flex items-center justify-center gap-2 w-full h-9 rounded-lg text-sm font-medium transition-all",
          "bg-[#F0F0F4] text-[#1A1A1A] hover:bg-[#E5E5EA] ring-1 ring-black/5",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        <Smartphone className="size-4" />
        导出手机版图纸
      </button>
    </div>
  );
}
