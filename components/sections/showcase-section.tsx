"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/layout/container";
import { samples } from "@/data/samples";
import { renderBeadGrid } from "@/lib/canvas-operations/render-grid";
import { BEAD_LIBRARY } from "@/lib/bead-library";
import type { BlueprintGrid, BeadPixel } from "@/lib/types";

// ─── Hand-crafted sample patterns ───

/** 16x16 Heart pattern using MARD bead colors */
const heartPattern: string[] = [
  "","","","","R","","","","","","R","","","","","",
  "","","","R","R","R","","","","R","R","R","","","","",
  "","","","R","R","R","R","","R","R","R","R","","","","",
  "","","","","R","R","R","R","R","R","R","","","","","",
  "","","","","","R","R","R","R","R","","","","","","",
  "","","","","","","R","R","R","","","","","","","",
  "","","","","","","","R","","","","","","","","",
  "","","","","","","","","","","","","","","","",
  "","","","","","P","W","W","W","","","","","","","",
  "","","","","P","","W","W","W","W","","","","","","",
  "","","","P","","P","W","W","W","W","W","","","","","",
  "","","","","P","","W","W","W","W","W","W","","","","",
  "","","","","","","W","W","W","W","W","","","","","",
  "","","","","","","","W","W","W","","","","","","",
  "","","","","","","","","W","","","","","","","",
  "","","","","","","","","","","","","","","","",
];

/** 32x32 Super Mushroom pattern */
const mushroomPattern: string[] = [
  "","","","","","","","","","","R","R","R","","","","","","","","","","","","","","","","","",
  "","","","","","","","","R","R","R","R","R","R","R","","","","","","","","","","","","","","","",
  "","","","","","","","R","R","R","R","R","R","R","R","R","","","","","","","","","","","","","",
  "","","","","","","R","R","R","W","W","W","W","R","R","R","R","","","","","","","","","","","",
  "","","","","","R","R","W","W","W","W","W","W","W","W","R","R","","","","","","","","","","","",
  "","","","","","R","W","W","W","W","W","W","W","W","W","W","R","","","","","","","","","","","",
  "","","","","R","W","W","R","W","R","W","W","R","W","R","W","W","R","","","","","","","","","",
  "","","","","R","W","W","W","W","W","W","W","W","W","W","W","W","R","","","","","","","","","",
  "","","","R","R","W","W","W","W","R","R","R","R","W","W","W","W","R","R","","","","","","","",
  "","","","R","R","W","R","W","R","W","W","W","W","R","W","R","W","R","R","","","","","","","",
  "","","R","R","W","W","W","R","R","W","W","W","W","R","R","W","W","W","R","R","","","","","",
  "","","R","R","W","W","W","W","W","W","W","W","W","W","W","W","W","W","R","R","","","","","",
  "","","R","R","W","W","W","W","W","W","W","W","W","W","W","W","W","W","R","R","","","","","",
  "","R","R","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","R","R","","","",
  "","R","R","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","R","R","","","",
  "R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R",
  "","R","W","R","W","W","R","R","R","W","W","W","W","R","R","R","W","W","R","W","R","W","W","R","","","","","","","","","",
  "","W","W","R","W","W","W","W","W","W","W","W","W","W","W","W","W","W","R","W","W","W","W","W","","","","","","","","","",
  "","","W","W","R","R","W","W","R","R","W","W","W","W","R","R","W","W","R","R","W","W","","","","","","","","","","","",
  "","","","W","W","R","R","W","W","R","R","W","W","R","R","W","W","R","R","W","W","","","","","","","","","","","","",
  "","","","","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","","","","","","","","","","","","","",
  "","","","","","","W","W","W","W","R","R","W","W","W","W","W","W","","","","","","","","","","","","","","","",
  "","","","","","W","R","R","R","R","R","R","R","R","R","R","W","W","","","","","","","","","","","","","","","",
  "","","","","","","W","R","R","R","R","R","R","R","R","W","W","","","","","","","","","","","","","","","","",
  "","","","","","","","W","W","R","R","R","R","W","W","W","","","","","","","","","","","","","","","","","",
  "","","","","","","","","W","W","W","W","W","W","","","","","","","","","","","","","","","","","","","",
  "","","","","","","","","","W","W","W","W","","","","","","","","","","","","","","","","","","","","",
  "","","","","","","","","","","W","W","","","","","","","","","","","","","","","","","","","","","",
];

/** 48x48 Cat face pattern */
const catPattern: string[] = (() => {
  const size = 48;
  const grid: string[] = new Array(size * size).fill("");
  // Colors: W=white, N=black, K=pink, Y=yellow, B=blue
  const cx = 24, cy = 26;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const dx = c - cx, dy = r - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Face outline (circle radius 18)
      if (dist < 18 && dist > 16) grid[r * size + c] = "N";
      // Face fill
      else if (dist < 16) grid[r * size + c] = "W";

      // Left ear (triangle)
      if (r < 14 && c > 4 && c < 20 && r + c * 1.3 > 26) {
        if (r > 8 && c > 7 && c < 16) grid[r * size + c] = "K";
        else if (r < 13) grid[r * size + c] = "N";
      }
      // Right ear (triangle)
      if (r < 14 && c > 28 && c < 44 && r + (size - c) * 1.3 > 26) {
        if (r > 8 && c > 32 && c < 41) grid[r * size + c] = "K";
        else if (r < 13) grid[r * size + c] = "N";
      }

      // Left eye
      if (Math.abs(dx + 6) < 4 && Math.abs(dy + 2) < 3) {
        grid[r * size + c] = Math.abs(dx + 6) < 2 && Math.abs(dy + 2) < 1.5 ? "Y" : "N";
      }
      // Right eye
      if (Math.abs(dx - 6) < 4 && Math.abs(dy + 2) < 3) {
        grid[r * size + c] = Math.abs(dx - 6) < 2 && Math.abs(dy + 2) < 1.5 ? "Y" : "N";
      }

      // Nose
      if (Math.abs(dx) < 2 && Math.abs(dy - 2) < 1.5) grid[r * size + c] = "K";
      // Mouth (lazy W shape)
      if (Math.abs(dy - 5) < 1 && Math.abs(dx) < 5 && Math.abs(dx) > 1) grid[r * size + c] = "N";
    }
  }
  return grid;
})();

// ─── Color shortcuts → bead library IDs ───
const COLOR_MAP: Record<string, string> = {
  W: "mard-m90",   // White
  N: "mard-h7",    // Black
  R: "mard-f6",    // Red
  P: "mard-e6",    // Pink
  K: "mard-e6",    // Pink (nose)
  Y: "mard-a5",    // Golden Yellow (eyes)
};

function buildGrid(data: string[], size: number): BlueprintGrid {
  const pixels: BeadPixel[][] = [];
  const lib = BEAD_LIBRARY;
  for (let row = 0; row < size; row++) {
    const rowPx: BeadPixel[] = [];
    for (let col = 0; col < size; col++) {
      const ch = data[row * size + col] || "";
      const beadId = COLOR_MAP[ch] || lib[0].id;
      const bead = lib.find((b) => b.id === beadId);
      rowPx.push({
        row, col,
        sourceRGB: bead?.rgb || { r: 255, g: 255, b: 255 },
        matchedBeadId: beadId,
      });
    }
    pixels.push(rowPx);
  }
  return { pixelSize: size, width: size, height: size, pixels };
}

// ─── SampleCanvas renders a preview ───
function SampleCanvas({ data, size }: { data: string[]; size: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const displaySize = 200;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const grid = buildGrid(data, size);
    renderBeadGrid({
      ctx, grid,
      options: {
        showGridLines: false,
        gridLineColor: "#CCC",
        gridLineWidth: 1,
        showNumbers: false,
        numberColor: "#333",
        numberFontSize: 8,
      },
      canvasWidth: displaySize,
      canvasHeight: displaySize,
      brandId: "mard",
    });
  }, [data, size]);

  return <canvas ref={canvasRef} className="rounded-lg" />;
}

export function ShowcaseSection() {
  const patterns = [
    { data: heartPattern, size: 16 },
    { data: mushroomPattern, size: 32 },
    { data: catPattern, size: 48 },
  ];

  return (
    <section id="showcase" className="py-20 sm:py-28 bg-[#F8F8FA]">
      <Container>
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            看看能做出什么
          </h2>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            上传任意照片或设计稿，AI 自动生成对应风格的拼豆图纸
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {samples.map((sample, i) => (
            <div
              key={sample.id}
              className="group rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden hover:shadow-sm hover:ring-black/10 transition-all"
            >
              {/* Real bead pattern preview */}
              <div className="aspect-square bg-[#FAFAF8] flex items-center justify-center p-4">
                <SampleCanvas data={patterns[i].data} size={patterns[i].size} />
              </div>

              <div className="p-4 border-t border-black/5">
                <h3 className="text-sm font-semibold text-[#1A1A1A]">
                  {sample.title}
                </h3>
                <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                  {sample.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-medium text-[#9B9B9B] bg-[#F0F0F4] px-2 py-0.5 rounded-full">
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
