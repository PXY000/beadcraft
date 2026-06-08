"use client";

import { useCallback } from "react";
import { Container } from "@/components/layout/container";
import { ImageUploader } from "@/components/generator/image-uploader";
import { PixelSizeSelector } from "@/components/generator/pixel-size-selector";
import { BrandSelector } from "@/components/generator/brand-selector";
import { SmartOptimizeToggle } from "@/components/generator/smart-optimize-toggle";
import { DitherToggle } from "@/components/generator/dither-toggle";
import { BlueprintCanvas } from "@/components/generator/blueprint-canvas";
import { BlueprintControls } from "@/components/generator/blueprint-controls";
import { StatisticsPanel } from "@/components/generator/statistics-panel";
import { ColorLegend } from "@/components/generator/color-legend";
import { ExportButton } from "@/components/generator/export-button";
import { useGeneratorState } from "@/hooks/use-generator-state";
import { useImageUpload } from "@/hooks/use-image-upload";
import type { BrandId } from "@/lib/types";

export function GeneratorSection() {
  const { state, dispatch } = useGeneratorState();
  const {
    isDragging,
    previewUrl,
    handleDrop,
    handleFileSelect: uploadFile,
    reset: resetUpload,
  } = useImageUpload();

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        const result = await uploadFile(file);
        dispatch({ type: "SET_IMAGE", payload: result });
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          payload: err instanceof Error ? err.message : "上传失败",
        });
      }
    },
    [uploadFile, dispatch]
  );

  const handleReset = useCallback(() => {
    resetUpload();
    dispatch({ type: "RESET" });
  }, [resetUpload, dispatch]);

  const handleDemoClick = useCallback(async () => {
    try {
      const res = await fetch("/samples/猫咪.png");
      const blob = await res.blob();
      const file = new File([blob], "demo-cat.png", { type: "image/png" });
      await handleFileSelect(file);
    } catch {
      // silently fail — demo image may not be available
    }
  }, [handleFileSelect]);

  return (
    <section id="generator" className="py-20 sm:py-28 bg-[#06060B] border-t border-white/[0.12]">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            在线生成图纸
          </h2>
          <p className="mt-2 text-sm text-white/40">
            上传图片，选择厂家色号，自定义网格参数，实时预览拼豆效果
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left sidebar: Controls */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-5">
              <ImageUploader
                previewUrl={previewUrl}
                isDragging={isDragging}
                phase={state.phase}
                onFileSelect={handleFileSelect}
                onReset={handleReset}
                onDemoClick={state.phase === "idle" ? handleDemoClick : undefined}
              />

              {state.phase !== "idle" && (
                <details className="group/config rounded-2xl bg-white/[0.05] backdrop-blur-xl ring-1 ring-white/[0.12]" open>
                  <summary className="flex items-center justify-between p-5 cursor-pointer select-none marker:content-none">
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wide">
                      配置清单
                    </span>
                    <svg
                      className="size-3.5 text-white/40 transition-transform group-open/config:rotate-180"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="space-y-5 px-5 pb-5">
                    <BrandSelector
                      value={state.brandId}
                      onChange={(brand: BrandId) =>
                        dispatch({ type: "SET_BRAND", payload: brand })
                      }
                      disabled={state.phase === "processing"}
                    />
                    <PixelSizeSelector
                      width={state.pixelWidth}
                      height={state.pixelHeight}
                      onChange={(w, h) =>
                        dispatch({ type: "SET_PIXEL_DIMENSIONS", payload: { width: w, height: h } })
                      }
                      disabled={state.phase === "processing"}
                    />
                    <SmartOptimizeToggle
                      enabled={state.smartOptimize}
                      onToggle={() => dispatch({ type: "TOGGLE_SMART_OPTIMIZE" })}
                      disabled={state.phase === "processing"}
                    />
                    <DitherToggle
                      enabled={state.dither}
                      onToggle={() => dispatch({ type: "TOGGLE_DITHER" })}
                      disabled={state.phase === "processing"}
                    />
                    <BlueprintControls
                      options={state.gridOptions}
                      onChange={(opts) =>
                        dispatch({ type: "SET_GRID_OPTIONS", payload: opts })
                      }
                      disabled={state.phase === "processing"}
                    />
                  </div>
                </details>
              )}

              {state.error && (
                <div className="p-4 rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
                  <p className="text-sm text-red-400">{state.error}</p>
                  <button
                    onClick={handleReset}
                    className="mt-2 text-xs font-medium text-red-300 hover:text-red-200"
                  >
                    重试 →
                  </button>
                </div>
              )}

              {state.phase === "ready" && (
                <ExportButton
                  grid={state.blueprint}
                  statistics={state.statistics}
                  options={state.exportOptions}
                  brandId={state.brandId}
                />
              )}
            </div>
          </div>

          {/* Right: Canvas + stats */}
          <div className="lg:col-span-2 space-y-6">
            <BlueprintCanvas
              grid={state.blueprint}
              gridOptions={state.gridOptions}
              phase={state.phase}
              brandId={state.brandId}
              originalImageUrl={previewUrl}
            />
            {state.phase === "ready" && (
              <>
                <StatisticsPanel statistics={state.statistics} brandId={state.brandId} />
                <ColorLegend statistics={state.statistics} />
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
