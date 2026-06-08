"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw, Eye, ImageIcon, ArrowLeftRight, ArrowUpDown } from "lucide-react";
import type { BlueprintGrid, GridOptions, BrandId } from "@/lib/types";
import { renderBeadGrid } from "@/lib/canvas-operations/render-grid";
import { cn } from "@/lib/utils";

interface BlueprintCanvasProps {
  grid: BlueprintGrid | null;
  gridOptions: GridOptions;
  phase: string;
  brandId: BrandId;
  originalImageUrl?: string | null;
}

const ZOOM_STEPS = [0.5, 0.75, 1, 1.5, 2, 3, 4];
const MAX_PAN = 2000;

export function BlueprintCanvas({
  grid,
  gridOptions,
  phase,
  brandId,
  originalImageUrl,
}: BlueprintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [zoomIdx, setZoomIdx] = useState(2); // default 1x = index 2
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showOriginal, setShowOriginal] = useState(false);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const scale = ZOOM_STEPS[zoomIdx];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper || !grid) return;

    const dpr = window.devicePixelRatio || 1;
    const wrapperWidth = wrapper.clientWidth;
    // Use most of the available width
    const size = Math.min(wrapperWidth, 850);

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

  // Pan with mouse drag (right button or middle button, or shift+left)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Left click + shift, or middle click, or right click
      if (e.button === 0 && e.shiftKey || e.button === 1 || e.button === 2) {
        e.preventDefault();
        isPanning.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
        if (wrapperRef.current) {
          wrapperRef.current.style.cursor = "grabbing";
        }
      }
    },
    []
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setPan((prev) => ({
      x: clamp(prev.x + dx, -MAX_PAN, MAX_PAN),
      y: clamp(prev.y + dy, -MAX_PAN, MAX_PAN),
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
    if (wrapperRef.current) {
      wrapperRef.current.style.cursor = scale > 1 ? "grab" : "default";
    }
  }, [scale]);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.cursor = scale > 1 ? "grab" : "default";
    }
  }, [scale]);

  const zoomIn = () => setZoomIdx((i) => Math.min(i + 1, ZOOM_STEPS.length - 1));
  const zoomOut = () => setZoomIdx((i) => Math.max(i - 1, 0));
  const zoomReset = () => {
    setZoomIdx(2);
    setPan({ x: 0, y: 0 });
  };

  // Prevent context menu on canvas area
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
          <svg className="size-7 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" /><circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
            <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" /><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <p className="text-sm font-medium text-white/40">上传图片即可生成拼豆图纸</p>
        <p className="text-xs text-white/40 mt-1">拖拽图片到左侧或点击上传区域开始</p>
      </div>
    );
  }

  if (phase === "processing") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-10 border-2 border-[#5E6AD2] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-white/40">正在处理图片...</p>
        <p className="text-xs text-white/40 mt-1">像素化处理并匹配拼豆颜色</p>
      </div>
    );
  }

  if (!grid) return null;

  return (
    <div>
      {/* Zoom controls + comparison toggle */}
      <div className="flex items-center justify-center gap-1 mb-3">
        <button
          onClick={zoomOut}
          disabled={zoomIdx === 0}
          className="size-8 rounded-lg flex items-center justify-center text-white/40 hover:bg-white/[0.06] hover:text-white/80 transition-colors disabled:opacity-30"
          title="缩小 (滚轮向下)"
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          onClick={zoomReset}
          className="px-2.5 h-7 rounded-lg text-xs font-medium text-white/40 hover:bg-white/[0.06] hover:text-white/80 transition-colors flex items-center gap-1"
          title="重置缩放和位置"
        >
          <RotateCcw className="size-3" />
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={zoomIn}
          disabled={zoomIdx === ZOOM_STEPS.length - 1}
          className="size-8 rounded-lg flex items-center justify-center text-white/40 hover:bg-white/[0.06] hover:text-white/80 transition-colors disabled:opacity-30"
          title="放大 (滚轮向上)"
        >
          <ZoomIn className="size-4" />
        </button>

        {/* Flip buttons */}
        <div className="h-7 mx-2 w-px bg-white/[0.08]" />
        <button
          onClick={() => setFlipH(!flipH)}
          className={cn(
            "size-7 rounded-lg flex items-center justify-center transition-colors",
            flipH ? "bg-white/[0.10] text-white/70" : "text-white/40 hover:bg-white/[0.06] hover:text-white/70"
          )}
          title="水平翻转"
        >
          <ArrowLeftRight className="size-3.5" />
        </button>
        <button
          onClick={() => setFlipV(!flipV)}
          className={cn(
            "size-7 rounded-lg flex items-center justify-center transition-colors",
            flipV ? "bg-white/[0.10] text-white/70" : "text-white/40 hover:bg-white/[0.06] hover:text-white/70"
          )}
          title="垂直翻转"
        >
          <ArrowUpDown className="size-3.5" />
        </button>

        {originalImageUrl && (
          <div className="h-7 mx-1 w-px bg-white/[0.08]" />
        )}
        {originalImageUrl && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className={cn(
              "px-2.5 h-7 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5",
              showOriginal
                ? "bg-white/[0.08] text-white/70"
                : "text-white/45 hover:bg-white/[0.06] hover:text-white/50"
            )}
            title="切换原图/结果对比"
          >
            {showOriginal ? (
              <Eye className="size-3" />
            ) : (
              <ImageIcon className="size-3" />
            )}
            {showOriginal ? "原图" : "结果"}
          </button>
        )}
      </div>

      {/* Canvas wrapper with pan/zoom */}
      <motion.div
        ref={wrapperRef}
        className="flex justify-center overflow-hidden rounded-xl bg-white/[0.05] backdrop-blur-xl ring-1 ring-white/[0.12] p-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        style={{ minHeight: 200 }}
      >
        <div
          ref={containerRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
            transition: isPanning.current ? "none" : "transform 0.15s ease-out",
          }}
        >
          {showOriginal && originalImageUrl ? (
            <div
              style={{
                width: `${Math.min(wrapperRef.current?.clientWidth ?? 400, 850)}px`,
                height: `${Math.min(wrapperRef.current?.clientWidth ?? 400, 850)}px`,
              }}
              className="flex items-center justify-center"
            >
              <img
                src={originalImageUrl}
                alt="原图"
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>
          ) : (
            <canvas ref={canvasRef} />
          )}
        </div>
      </motion.div>

    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
