"use client";

import { useState } from "react";
import { Download, Smartphone, FileImage, ChevronDown } from "lucide-react";
import type { BlueprintGrid, BlueprintStatistics, ExportOptions, BrandId } from "@/lib/types";
import { exportBlueprintPNG, exportBlueprintPNGMobile } from "@/lib/canvas-operations/export-png";
import { exportBlueprintSVG, exportBlueprintSVGMobile } from "@/lib/canvas-operations/export-svg";
import { cn } from "@/lib/utils";

interface ExportButtonProps {
  grid: BlueprintGrid | null;
  statistics: BlueprintStatistics | null;
  options: ExportOptions;
  brandId: BrandId;
  disabled?: boolean;
  className?: string;
}

const BEAD_SIZE_PRESETS = [24, 28, 32, 36, 40, 48, 56, 64] as const;

export function ExportButton({
  grid,
  statistics,
  options,
  brandId,
  disabled,
  className,
}: ExportButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [beadSize, setBeadSize] = useState(32);
  const [svgBeadSize, setSvgBeadSize] = useState(32);

  const maxGridDim = Math.max(grid?.width ?? 32, grid?.height ?? 32);
  const maxBeadSize = Math.max(16, Math.floor(800 / maxGridDim));

  const handleExportPNG = async () => {
    if (!grid || !statistics) return;
    try {
      await exportBlueprintPNG(grid, statistics, { ...options, beadPixelSize: beadSize }, brandId);
    } catch (err) {
      console.error("PNG 导出失败:", err);
    }
  };

  const handleExportPNGMobile = async () => {
    if (!grid || !statistics) return;
    try {
      await exportBlueprintPNGMobile(grid, statistics, { ...options, beadPixelSize: beadSize }, brandId);
    } catch (err) {
      console.error("手机 PNG 导出失败:", err);
    }
  };

  const handleExportSVG = () => {
    if (!grid || !statistics) return;
    try {
      exportBlueprintSVG(grid, statistics, { beadSize: svgBeadSize, showGrid: options.showGrid, showNumbers: options.showNumbers, includeLegend: options.includeLegend, includeStats: options.includeStats }, brandId);
    } catch (err) {
      console.error("SVG 导出失败:", err);
    }
  };

  const handleExportSVGMobile = () => {
    if (!grid || !statistics) return;
    try {
      exportBlueprintSVGMobile(grid, statistics, brandId);
    } catch (err) {
      console.error("手机 SVG 导出失败:", err);
    }
  };

  if (!grid) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {/* SVG 矢量导出 — 推荐，无限缩放不模糊 */}
      <div className="p-3.5 rounded-xl bg-white/[0.05] backdrop-blur-xl ring-1 ring-[#5E6AD2]/15">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] font-bold text-[#5E6AD2] uppercase tracking-wider bg-white/[0.08] px-1.5 py-0.5 rounded">推荐</span>
          <span className="text-xs font-semibold text-white/80">SVG 矢量图纸</span>
          <span className="text-[10px] text-white/40">· 无限缩放 · 永远清晰</span>
        </div>

        {/* SVG bead size */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] text-white/40 shrink-0">像素大小:</span>
          <div className="flex flex-wrap gap-1">
            {BEAD_SIZE_PRESETS.filter((s) => s <= maxBeadSize || s <= 40).map((size) => (
              <button
                key={size}
                onClick={() => setSvgBeadSize(size)}
                className={cn(
                  "py-0.5 px-1.5 text-[10px] font-medium rounded transition-colors",
                  svgBeadSize === size
                    ? "bg-[#5E6AD2] text-white"
                    : "bg-white/[0.06] text-white/40 hover:text-white/80 hover:bg-white/[0.10]"
                )}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportSVG}
            disabled={disabled}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium bg-[#5E6AD2] text-white hover:bg-[#4A56C0] transition-colors disabled:opacity-40"
          >
            <FileImage className="size-3.5" />
            导出 SVG
          </button>
          <button
            onClick={handleExportSVGMobile}
            disabled={disabled}
            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-white/[0.08] text-[#7B8AFF] hover:bg-white/[0.12] ring-1 ring-[#5E6AD2]/20 transition-colors disabled:opacity-40"
          >
            <Smartphone className="size-3.5" />
            手机版
          </button>
        </div>
      </div>

      {/* PNG 位图导出 */}
      <details className="group" open={false}>
        <summary className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-white/40 hover:text-white/80 transition-colors select-none py-1">
          <ChevronDown className="size-3 transition-transform group-open:rotate-180" />
          PNG 位图导出
          <span className="text-[10px] text-white/40 font-normal">· 选大像素可看清编号</span>
        </summary>

        <div className="mt-2 space-y-2.5 pl-1">
          {/* PNG bead size */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40 shrink-0">像素大小:</span>
            <div className="flex flex-wrap gap-1">
              {BEAD_SIZE_PRESETS.filter((s) => s <= maxBeadSize || s <= 40).map((size) => (
                <button
                  key={size}
                  onClick={() => setBeadSize(size)}
                  className={cn(
                    "py-0.5 px-1.5 text-[10px] font-medium rounded transition-colors",
                    beadSize === size
                      ? "bg-white text-[#0A0A0A]"
                      : "bg-white/[0.06] text-white/40 hover:text-white/80 hover:bg-white/[0.10]"
                  )}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>
          {(grid?.width ?? 0) >= 40 && beadSize < 28 && (
            <p className="text-[10px] text-amber-300 bg-amber-500/10 rounded-lg px-2 py-1">
              ⚠️ 网格 {(grid?.width ?? 0)}×{(grid?.height ?? 0)} 较大，建议选 ≥{Math.min(40, maxBeadSize)}px 或使用 SVG 导出以看清编号
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleExportPNG}
              disabled={disabled}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium bg-white text-[#0A0A0A] hover:bg-white/90 transition-colors disabled:opacity-40"
            >
              <Download className="size-3.5" />
              导出 PNG
            </button>
            <button
              onClick={handleExportPNGMobile}
              disabled={disabled}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-white/[0.06] text-white/80 hover:bg-white/[0.10] ring-1 ring-white/[0.08] transition-colors disabled:opacity-40"
            >
              <Smartphone className="size-3.5" />
              手机版
            </button>
          </div>
        </div>
      </details>

      {/* 手机保存提示 */}
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
        <svg className="size-3.5 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <p className="text-[11px] text-amber-300 leading-relaxed">
          下载后用<strong>浏览器打开</strong>图纸文件即可直接保存到手机相册。SVG 矢量图支持双指缩放查看细节，推荐使用手机自带浏览器打开。
        </p>
      </div>
    </div>
  );
}
