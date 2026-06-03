"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import type { BlueprintGrid, GridOptions, BrandId } from "@/lib/types";
import { renderBeadGrid } from "@/lib/canvas-operations/render-grid";

interface BlueprintCanvasProps {
  grid: BlueprintGrid | null;
  gridOptions: GridOptions;
  phase: string;
  brandId: BrandId;
}

const ZOOM_STEPS = [0.5, 0.75, 1, 1.5, 2, 3, 4];

export function BlueprintCanvas({
  grid,
  gridOptions,
  phase,
  brandId,
}: BlueprintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomIdx, setZoomIdx] = useState(2); // default 1x = index 2

  const scale = ZOOM_STEPS[zoomIdx];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !grid) return;

    const dpr = window.devicePixelRatio || 1;
    const containerWidth = container.clientWidth;
    // Larger canvas — use most of the available width
    const size = Math.min(containerWidth, 850);

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    renderBeadGrid({
      ctx,
      grid,
      options: gridOptions,
      canvasWidth: size,
      canvasHeight: size,
      brandId,
      scale,
    });
  }, [grid, gridOptions, brandId, scale]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  const zoomIn = () => setZoomIdx((i) => Math.min(i + 1, ZOOM_STEPS.length - 1));
  const zoomOut = () => setZoomIdx((i) => Math.max(i - 1, 0));
  const zoomReset = () => setZoomIdx(2);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-16 rounded-2xl bg-[#F0F0F4] flex items-center justify-center mb-4">
          <svg className="size-7 text-[#9B9B9B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" /><circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
            <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" /><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[#6B6B6B]">上传图片即可生成拼豆图纸</p>
        <p className="text-xs text-[#9B9B9B] mt-1">网格预览将在此处显示</p>
      </div>
    );
  }

  if (phase === "processing") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-10 border-2 border-[#5E6AD2] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-[#6B6B6B]">正在处理图片...</p>
        <p className="text-xs text-[#9B9B9B] mt-1">像素化处理并匹配拼豆颜色</p>
      </div>
    );
  }

  if (!grid) return null;

  return (
    <div>
      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-1 mb-3">
        <button
          onClick={zoomOut}
          disabled={zoomIdx === 0}
          className="size-8 rounded-lg flex items-center justify-center text-[#6B6B6B] hover:bg-[#F0F0F4] hover:text-[#1A1A1A] transition-colors disabled:opacity-30"
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          onClick={zoomReset}
          className="px-2.5 h-7 rounded-lg text-xs font-medium text-[#6B6B6B] hover:bg-[#F0F0F4] hover:text-[#1A1A1A] transition-colors flex items-center gap-1"
        >
          <RotateCcw className="size-3" />
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={zoomIn}
          disabled={zoomIdx === ZOOM_STEPS.length - 1}
          className="size-8 rounded-lg flex items-center justify-center text-[#6B6B6B] hover:bg-[#F0F0F4] hover:text-[#1A1A1A] transition-colors disabled:opacity-30"
        >
          <ZoomIn className="size-4" />
        </button>
      </div>

      {/* Canvas */}
      <motion.div
        ref={containerRef}
        className="flex justify-center overflow-auto"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <canvas ref={canvasRef} className="rounded-xl ring-1 ring-black/5 shadow-sm" />
      </motion.div>
    </div>
  );
}
