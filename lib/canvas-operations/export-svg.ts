import type { BlueprintGrid, BlueprintStatistics, BrandId } from "../types";
import { BEAD_LIBRARY } from "../bead-library";
import { columnLabel } from "../constants";

interface SvgExportOptions {
  beadSize: number;
  showGrid: boolean;
  showNumbers: boolean;
  includeLegend: boolean;
  includeStats: boolean;
}

const DEFAULT_SVG_OPTIONS: SvgExportOptions = {
  beadSize: 32,
  showGrid: true,
  showNumbers: true,
  includeLegend: true,
  includeStats: true,
};

function getBeadCode(beadId: string, brandId: BrandId): string {
  const bead = BEAD_LIBRARY.find((b) => b.id === beadId);
  if (!bead) return "";
  return bead.codes[brandId];
}

function svgText(x: number, y: number, text: string, opts: { size?: number; bold?: boolean; fill?: string; anchor?: string } = {}): string {
  const { size = 12, bold = false, fill = "#333", anchor = "middle" } = opts;
  return `<text x="${x}" y="${y}" font-family="system-ui, sans-serif" font-size="${size}" ${bold ? 'font-weight="bold"' : ""} fill="${fill}" text-anchor="${anchor}" dominant-baseline="central">${esc(text)}</text>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function generateBlueprintSVG(
  grid: BlueprintGrid,
  statistics: BlueprintStatistics,
  options: Partial<SvgExportOptions> = {},
  brandId: BrandId = "mard"
): string {
  const opts = { ...DEFAULT_SVG_OPTIONS, ...options };
  const { width: cols, height: rows, pixels } = grid;
  const bs = opts.beadSize;

  // Layout constants
  const labelMargin = 40;
  const legendColW = 160;
  const legendRowH = 22;
  const sectionGap = 24;
  const titleH = 52;
  const statsH = opts.includeStats ? 90 : 0;
  const padding = 20;

  const gridW = cols * bs;
  const gridH = rows * bs;

  const contentW = labelMargin * 2 + gridW;
  const svgW = Math.max(contentW, 800);

  // Legend dimensions
  const usedColors = statistics.beadCounts.filter((s) => s.count > 0);
  const legendCols = Math.max(1, Math.floor((svgW - padding * 2) / legendColW));
  const legendRows = Math.ceil(usedColors.length / legendCols);
  const legendH = opts.includeLegend ? 36 + legendRows * legendRowH + 16 : 0;

  // Total height
  const gridSectionH = labelMargin * 2 + gridH;
  let totalH = padding + titleH + sectionGap + gridSectionH;
  if (legendH > 0) totalH += sectionGap + legendH;
  if (statsH > 0) totalH += sectionGap + statsH;
  totalH += padding;

  const parts: string[] = [];

  // Grid beads
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const beadId = pixels[row][col].matchedBeadId;
      const bead = BEAD_LIBRARY.find((b) => b.id === beadId);
      if (!bead) continue;

      const x = labelMargin + col * bs;
      const gy = padding + titleH + sectionGap + labelMargin + row * bs;

      parts.push(`<rect x="${x}" y="${gy}" width="${bs}" height="${bs}" fill="${bead.hex}" />`);

      if (opts.showGrid && bs >= 6) {
        parts.push(`<rect x="${x}" y="${gy}" width="${bs}" height="${bs}" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="${Math.max(0.5, bs * 0.04)}" />`);
      }

      if (opts.showNumbers && bs >= 16) {
        const code = getBeadCode(beadId, brandId);
        const brightness = (bead.rgb.r * 299 + bead.rgb.g * 587 + bead.rgb.b * 114) / 1000;
        const textColor = brightness > 140 ? "#1A1A1A" : "#FFFFFF";
        const fontSize = Math.max(7, Math.floor(bs * 0.38));
        parts.push(svgText(x + bs / 2, gy + bs / 2, code, { size: fontSize, bold: true, fill: textColor }));
      }
    }
  }

  // Outer border
  const gridX = labelMargin;
  const gridY = padding + titleH + sectionGap + labelMargin;
  parts.push(`<rect x="${gridX}" y="${gridY}" width="${gridW}" height="${gridH}" fill="none" stroke="#666" stroke-width="2" />`);

  // Coordinate labels
  const labelSize = Math.min(11, Math.max(7, bs * 0.35));

  for (let col = 0; col < cols; col++) {
    const cx = labelMargin + col * bs + bs / 2;
    parts.push(svgText(cx, gridY - labelMargin / 2, columnLabel(col), { size: labelSize, bold: true }));
    parts.push(svgText(cx, gridY + gridH + labelMargin / 2, columnLabel(col), { size: labelSize, bold: true }));
  }

  for (let row = 0; row < rows; row++) {
    const cy = gridY + row * bs + bs / 2;
    parts.push(svgText(labelMargin / 2, cy, `${row + 1}`, { size: labelSize, bold: true }));
    parts.push(svgText(labelMargin + gridW + labelMargin / 2, cy, `${row + 1}`, { size: labelSize, bold: true }));
  }

  // Grid lines
  if (opts.showGrid && bs >= 8) {
    for (let col = 0; col <= cols; col++) {
      const x = labelMargin + col * bs;
      parts.push(`<line x1="${x}" y1="${gridY}" x2="${x}" y2="${gridY + gridH}" stroke="#B0B0B0" stroke-width="1" />`);
    }
    for (let row = 0; row <= rows; row++) {
      const y = gridY + row * bs;
      parts.push(`<line x1="${gridX}" y1="${y}" x2="${gridX + gridW}" y2="${y}" stroke="#B0B0B0" stroke-width="1" />`);
    }
  }

  // Title
  parts.push(svgText(svgW / 2, padding + titleH / 2, `BeadCraft · ${cols}×${rows} · ${brandId.toUpperCase()}`, { size: 16, bold: true, fill: "#1A1A1A" }));
  parts.push(`<line x1="${padding}" y1="${padding + titleH}" x2="${svgW - padding}" y2="${padding + titleH}" stroke="#E5E5E5" stroke-width="1" />`);

  // Legend
  let ly = gridY + gridH + labelMargin + sectionGap;
  if (opts.includeLegend && usedColors.length > 0) {
    parts.push(svgText(padding, ly + 14, `配色对照表 (${brandId.toUpperCase()})`, { size: 14, bold: true, anchor: "start" }));
    parts.push(`<line x1="${padding}" y1="${ly + 24}" x2="${svgW - padding}" y2="${ly + 24}" stroke="#E0E0E0" stroke-width="1" />`);

    const swatchSize = 16;
    usedColors.forEach((entry, i) => {
      const col = i % legendCols;
      const r = Math.floor(i / legendCols);
      const sx = padding + col * legendColW;
      const sy = ly + 38 + r * legendRowH;
      const code = entry.bead.codes[brandId];

      parts.push(`<rect x="${sx}" y="${sy}" width="30" height="16" rx="3" fill="#F0F0F4" />`);
      parts.push(svgText(sx + 15, sy + 8, code, { size: 8, bold: true, fill: "#5E6AD2" }));
      parts.push(`<rect x="${sx + 35}" y="${sy}" width="${swatchSize}" height="${swatchSize}" fill="${entry.bead.hex}" stroke="#CCC" stroke-width="1" />`);
      parts.push(svgText(sx + 56, sy + 8, `${entry.bead.nameZh}  ×${entry.count}`, { size: 11, fill: "#333", anchor: "start" }));
    });
    ly += legendH + sectionGap;
  }

  // Stats
  if (opts.includeStats) {
    parts.push(svgText(padding, ly + 14, "图纸信息", { size: 14, bold: true, anchor: "start" }));
    parts.push(`<line x1="${padding}" y1="${ly + 24}" x2="${svgW - padding}" y2="${ly + 24}" stroke="#E0E0E0" stroke-width="1" />`);

    const usedCount = statistics.beadCounts.filter((s) => s.count > 0).length;
    const statLines = [
      `网格尺寸: ${statistics.dimensions.cols} × ${statistics.dimensions.rows}`,
      `拼豆总数: ${statistics.totalBeads.toLocaleString()} 颗`,
      `使用颜色: ${usedCount} / ${statistics.beadCounts.length} 种`,
    ];
    statLines.forEach((line, i) => {
      parts.push(svgText(padding, ly + 46 + i * 20, line, { size: 12, fill: "#555", anchor: "start" }));
    });
  }

  // Footer
  parts.push(svgText(svgW / 2, totalH - 14, "beadcraft.online", { size: 10, fill: "#9B9B9B" }));

  // Assemble
  const svg = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${totalH}" width="${svgW}" height="${totalH}">`,
    `<rect width="${svgW}" height="${totalH}" fill="#F0EFED" />`,
    ...parts,
    `</svg>`,
  ].join("\n");

  return svg;
}

export function generateBlueprintSVGMobile(
  grid: BlueprintGrid,
  statistics: BlueprintStatistics,
  brandId: BrandId = "mard"
): string {
  const mobileWidth = 750;
  const maxDim = Math.max(grid.width, grid.height);
  const bs = Math.max(18, Math.floor((mobileWidth - 80) / maxDim));
  return generateBlueprintSVG(grid, statistics, { beadSize: bs, showGrid: true, showNumbers: true, includeLegend: true, includeStats: true }, brandId);
}

function buildSvgBlob(svg: string): Blob {
  return new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
}

export function exportBlueprintSVG(
  grid: BlueprintGrid,
  statistics: BlueprintStatistics,
  options: Partial<SvgExportOptions> = {},
  brandId: BrandId = "mard"
): void {
  const svg = generateBlueprintSVG(grid, statistics, options, brandId);
  const blob = buildSvgBlob(svg);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `beadcraft-${brandId}-${grid.width}x${grid.height}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportBlueprintSVGMobile(
  grid: BlueprintGrid,
  statistics: BlueprintStatistics,
  brandId: BrandId = "mard"
): void {
  const svg = generateBlueprintSVGMobile(grid, statistics, brandId);
  const blob = buildSvgBlob(svg);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `beadcraft-mobile-${brandId}-${grid.width}x${grid.height}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
