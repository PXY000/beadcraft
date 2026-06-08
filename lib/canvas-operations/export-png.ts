import type { BlueprintGrid, BlueprintStatistics, ExportOptions, BrandId } from "../types";
import { renderBeadGrid } from "./render-grid";
import { BEAD_LIBRARY } from "../bead-library";

const DEFAULT_OPTIONS: ExportOptions = {
  beadPixelSize: 28,
  showGrid: true,
  showNumbers: true,
  includeLegend: true,
  includeStats: true,
};

/** Standard landscape/detailed export — best for printing and desktop viewing */
export async function exportBlueprintPNG(
  grid: BlueprintGrid,
  statistics: BlueprintStatistics,
  options: Partial<ExportOptions> = {},
  brandId: BrandId = "mard"
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { width: cols, height: rows } = grid;

  // Margins for 4-direction coordinate labels
  const labelMargin = 40;
  const gridW = cols * opts.beadPixelSize;
  const gridH = rows * opts.beadPixelSize;
  const canvasWidth = gridW + labelMargin * 2;
  const gridCanvasHeight = gridH + labelMargin * 2;

  const legendHeight = opts.includeLegend ? 240 : 0;
  const statsHeight = opts.includeStats ? 140 : 0;
  const gap = 24;
  const totalHeight = gridCanvasHeight + (legendHeight ? gap + legendHeight : 0) + (statsHeight ? gap + statsHeight : 0);

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(canvasWidth, 900);
  canvas.height = totalHeight + 20;
  const ctx = canvas.getContext("2d")!;

  // White background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render grid
  renderBeadGrid({
    ctx,
    grid,
    options: {
      showGridLines: opts.showGrid,
      gridLineColor: "#B0B0B0",
      gridLineWidth: 1.5,
      showNumbers: opts.showNumbers,
      numberColor: "#1A1A1A",
      numberFontSize: Math.round(opts.beadPixelSize * 0.38),
    },
    canvasWidth: canvas.width,
    canvasHeight: gridCanvasHeight,
    brandId,
  });

  let yOffset = gridCanvasHeight + gap;

  // Color legend
  if (opts.includeLegend) {
    renderLegend(ctx, statistics, yOffset, canvas.width, legendHeight, brandId);
    yOffset += legendHeight + gap;
  }

  // Stats summary
  if (opts.includeStats) {
    renderStatsSummary(ctx, statistics, yOffset, canvas.width, statsHeight);
  }

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/png", 1.0)
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `beadcraft-${brandId}-${grid.width}x${grid.height}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Mobile-friendly portrait export — optimized for phone saving and viewing */
export async function exportBlueprintPNGMobile(
  grid: BlueprintGrid,
  statistics: BlueprintStatistics,
  options: Partial<ExportOptions> = {},
  brandId: BrandId = "mard"
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { width: cols, height: rows } = grid;

  // Mobile-optimized: narrower width, larger beads for readability
  const mobileWidth = 800;
  const labelMargin = 40;
  const gridH = rows * opts.beadPixelSize;
  const gridCanvasHeight = gridH + labelMargin * 2;

  // Compact legend + stats for mobile
  const legendRows = Math.ceil(statistics.beadCounts.filter((s) => s.count > 0).length / 3);
  const legendHeight = opts.includeLegend ? 56 + legendRows * 30 + 16 : 0;
  const statsHeight = opts.includeStats ? 100 : 0;
  const gap = 20;
  const headerHeight = 52;
  const footerHeight = 40;
  const totalHeight = headerHeight + gridCanvasHeight + (legendHeight ? gap + legendHeight : 0) + (statsHeight ? gap + statsHeight : 0) + footerHeight;

  const canvas = document.createElement("canvas");
  canvas.width = mobileWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d")!;

  // White background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ─── Header ───
  ctx.fillStyle = "#1A1A1A";
  ctx.font = "bold 16px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`BeadCraft · ${grid.width}×${grid.height} · ${brandId.toUpperCase()}`, canvas.width / 2, headerHeight / 2);

  ctx.strokeStyle = "#E5E5E5";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, headerHeight);
  ctx.lineTo(canvas.width - 20, headerHeight);
  ctx.stroke();

  // ─── Grid ───
  renderBeadGrid({
    ctx,
    grid,
    options: {
      showGridLines: opts.showGrid,
      gridLineColor: "#B0B0B0",
      gridLineWidth: 1.5,
      showNumbers: opts.showNumbers,
      numberColor: "#1A1A1A",
      numberFontSize: Math.round(opts.beadPixelSize * 0.38),
    },
    canvasWidth: mobileWidth,
    canvasHeight: gridCanvasHeight,
    brandId,
  });

  let yOffset = headerHeight + gridCanvasHeight + gap;

  // ─── Compact legend ───
  if (opts.includeLegend) {
    renderLegendCompact(ctx, statistics, yOffset, mobileWidth, brandId);
    yOffset += legendHeight + gap;
  }

  // ─── Stats ───
  if (opts.includeStats) {
    renderStatsSummary(ctx, statistics, yOffset, mobileWidth, statsHeight);
  }

  // ─── Footer ───
  ctx.fillStyle = "#9B9B9B";
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("beadcraft.online", canvas.width / 2, canvas.height - footerHeight / 2);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/png", 1.0)
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `beadcraft-mobile-${brandId}-${grid.width}x${grid.height}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function renderLegend(
  ctx: CanvasRenderingContext2D,
  stats: BlueprintStatistics,
  y: number,
  width: number,
  height: number,
  brandId: BrandId
): void {
  ctx.fillStyle = "#1A1A1A";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`配色对照表 (${brandId.toUpperCase()})`, 20, y + 22);

  ctx.strokeStyle = "#E0E0E0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, y + 32);
  ctx.lineTo(width - 20, y + 32);
  ctx.stroke();

  const swatchSize = 18;
  const colW = 170;
  const cols = Math.floor((width - 40) / colW);
  const usedColors = stats.beadCounts.filter((s) => s.count > 0);

  usedColors.forEach((entry, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const sx = 20 + col * colW;
    const sy = y + 48 + row * 26;
    const code = entry.bead.codes[brandId];

    // Code badge
    ctx.fillStyle = "#F0F0F4";
    ctx.beginPath();
    ctx.roundRect(sx, sy, 32, 18, 4);
    ctx.fill();
    ctx.fillStyle = "#5E6AD2";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(code, sx + 16, sy + 9);

    // Swatch
    ctx.fillStyle = entry.bead.hex;
    ctx.fillRect(sx + 38, sy, swatchSize, swatchSize);
    ctx.strokeStyle = "#CCCCCC";
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + 38, sy, swatchSize, swatchSize);

    // Label
    ctx.fillStyle = "#333333";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`${entry.bead.nameZh}  ×${entry.count}`, sx + 62, sy + 9);
  });
}

/** Compact legend for mobile export — 3 columns, smaller elements */
function renderLegendCompact(
  ctx: CanvasRenderingContext2D,
  stats: BlueprintStatistics,
  y: number,
  width: number,
  brandId: BrandId
): void {
  ctx.fillStyle = "#1A1A1A";
  ctx.font = "bold 14px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`配色对照表 (${brandId.toUpperCase()})`, 20, y + 20);

  ctx.strokeStyle = "#E0E0E0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, y + 30);
  ctx.lineTo(width - 20, y + 30);
  ctx.stroke();

  const swatchSize = 14;
  const colW = (width - 40) / 3;
  const usedColors = stats.beadCounts.filter((s) => s.count > 0);

  usedColors.forEach((entry, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const sx = 20 + col * colW;
    const sy = y + 42 + row * 24;
    const code = entry.bead.codes[brandId];

    // Swatch
    ctx.fillStyle = entry.bead.hex;
    ctx.fillRect(sx, sy, swatchSize, swatchSize);
    ctx.strokeStyle = "#CCCCCC";
    ctx.lineWidth = 1;
    ctx.strokeRect(sx, sy, swatchSize, swatchSize);

    // Code
    ctx.fillStyle = "#5E6AD2";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(code, sx + swatchSize + 4, sy + swatchSize / 2);

    // Label
    ctx.fillStyle = "#555555";
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillText(` ${entry.bead.nameZh} ×${entry.count}`, sx + swatchSize + 32, sy + swatchSize / 2);
  });
}

function renderStatsSummary(
  ctx: CanvasRenderingContext2D,
  stats: BlueprintStatistics,
  y: number,
  width: number,
  height: number
): void {
  ctx.fillStyle = "#1A1A1A";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("图纸信息", 20, y + 22);

  ctx.strokeStyle = "#E0E0E0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, y + 32);
  ctx.lineTo(width - 20, y + 32);
  ctx.stroke();

  ctx.font = "13px sans-serif";
  ctx.fillStyle = "#555555";
  const usedCount = stats.beadCounts.filter((s) => s.count > 0).length;
  const lines = [
    `网格尺寸: ${stats.dimensions.cols} × ${stats.dimensions.rows}`,
    `拼豆总数: ${stats.totalBeads.toLocaleString()} 颗`,
    `使用颜色: ${usedCount} / ${stats.beadCounts.length} 种`,
  ];
  lines.forEach((line, i) => {
    ctx.fillText(line, 20, y + 54 + i * 22);
  });
}
