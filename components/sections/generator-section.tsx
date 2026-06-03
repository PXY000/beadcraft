"use client";

import { useCallback } from "react";
import { Container } from "@/components/layout/container";
import { ImageUploader } from "@/components/generator/image-uploader";
import { PixelSizeSelector } from "@/components/generator/pixel-size-selector";
import { BrandSelector } from "@/components/generator/brand-selector";
import { SmartOptimizeToggle } from "@/components/generator/smart-optimize-toggle";
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

  return (
    <section id="generator" className="py-20 sm:py-28">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            在线生成图纸
          </h2>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            上传图片，选择厂家色号，自定义网格参数
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
              />

              {state.phase !== "idle" && (
                <div className="space-y-5 p-5 rounded-2xl bg-[#F8F8FA] ring-1 ring-black/5">
                  <BrandSelector
                    value={state.brandId}
                    onChange={(brand: BrandId) =>
                      dispatch({ type: "SET_BRAND", payload: brand })
                    }
                    disabled={state.phase === "processing"}
                  />
                  <PixelSizeSelector
                    value={state.pixelSize}
                    onChange={(size) =>
                      dispatch({ type: "SET_PIXEL_SIZE", payload: size })
                    }
                    disabled={state.phase === "processing"}
                  />
                  <SmartOptimizeToggle
                    enabled={state.smartOptimize}
                    onToggle={() => dispatch({ type: "TOGGLE_SMART_OPTIMIZE" })}
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
              )}

              {state.error && (
                <div className="p-4 rounded-xl bg-red-50 ring-1 ring-red-100">
                  <p className="text-sm text-red-600">{state.error}</p>
                  <button
                    onClick={handleReset}
                    className="mt-2 text-xs font-medium text-red-700 hover:text-red-800"
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
