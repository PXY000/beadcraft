"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { samples } from "@/data/samples";
import { renderBeadGrid } from "@/lib/canvas-operations/render-grid";
import { BEAD_LIBRARY } from "@/lib/bead-library";
import type { BlueprintGrid, BeadPixel } from "@/lib/types";

const COLOR_MAP: Record<string, string> = {
  W: "mard-m90", N: "mard-h7", R: "mard-f6", P: "mard-e6", K: "mard-e6", Y: "mard-a5",
};

// Heart fallback pattern
const heart16 = [
  "","","","","R","","","","","","R","","","","","",
  "","","","R","R","R","","","","R","R","R","","","","",
  "","","","R","R","R","R","","R","R","R","R","","","","",
  "","","","","R","R","R","R","R","R","R","","","","","",
  "","","","","","R","R","R","R","R","","","","","","",
  "","","","","","","R","R","R","","","","","","","",
  "","","","","","","","R","","","","","","","","",
  "","","","","","P","W","W","W","","","","","","","",
  "","","","","P","","W","W","W","W","","","","","","",
  "","","","","","P","W","W","W","W","W","","","","","",
  "","","","","","","W","W","W","W","W","","","","","",
  "","","","","","","","W","W","W","","","","","","",
];

function buildGrid(data: string[], size: number): BlueprintGrid {
  const pixels: BeadPixel[][] = [];
  for (let row = 0; row < size; row++) {
    const rowPx: BeadPixel[] = [];
    for (let col = 0; col < size; col++) {
      const ch = data[row * size + col] || "";
      const beadId = COLOR_MAP[ch] || BEAD_LIBRARY[0].id;
      const bead = BEAD_LIBRARY.find((b) => b.id === beadId);
      rowPx.push({ row, col, sourceRGB: bead?.rgb || { r: 255, g: 255, b: 255 }, matchedBeadId: beadId });
    }
    pixels.push(rowPx);
  }
  return { pixelSize: size, width: size, height: size, pixels };
}

function FallbackCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const d = window.devicePixelRatio || 1, s = 200;
    c.style.width = `${s}px`; c.style.height = `${s}px`;
    c.width = s * d; c.height = s * d;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.scale(d, d);
    renderBeadGrid({ ctx, grid: buildGrid(heart16, 16), options: { showGridLines: false, gridLineColor: "#CCC", gridLineWidth: 1, showNumbers: false, numberColor: "#333", numberFontSize: 8 }, canvasWidth: s, canvasHeight: s, brandId: "mard" });
  }, []);
  return <canvas ref={ref} className="rounded-lg" />;
}

export function ShowcaseSection() {
  return (
    <section id="showcase" className="py-20 sm:py-28 bg-[#0A0A0F]">
      <Container>
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            看看能做出什么
          </h2>
          <p className="mt-2 text-sm text-white/40">
            上传任意照片或设计稿，自动生成对应风格的拼豆图纸
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {samples.map((sample) => (
            <div
              key={sample.id}
              className="group rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06] overflow-hidden hover:ring-white/[0.12] hover:bg-white/[0.05] transition-all"
            >
              {/* Preview: real image or Canvas fallback */}
              <div className="aspect-square bg-white/[0.02] flex items-center justify-center p-4">
                {sample.image ? (
                  <Image
                    src={sample.image}
                    alt={sample.title}
                    width={240}
                    height={240}
                    className="object-contain rounded-lg"
                    unoptimized
                  />
                ) : (
                  <FallbackCanvas />
                )}
              </div>

              <div className="p-4 border-t border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white/80">{sample.title}</h3>
                <p className="text-xs text-white/40 mt-1 leading-relaxed">{sample.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-medium text-white/30 bg-white/[0.06] px-2 py-0.5 rounded-full">
                    {sample.pixelSize}×{sample.pixelSize}
                  </span>
                  <span className="text-[10px] font-medium text-[#9B9B9B] bg-[#F0F0F4] px-2 py-0.5 rounded-full">
                    {sample.beadCount} 颗
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

              </Container>
    </section>
  );
}
