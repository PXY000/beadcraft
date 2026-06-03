import type { BlueprintGrid, GridOptions, BrandId } from "../types";
import { BEAD_LIBRARY } from "../bead-library";
import { columnLabel } from "../constants";

interface RenderGridParams {
  ctx: CanvasRenderingContext2D;
  grid: BlueprintGrid;
  options: GridOptions;
  canvasWidth: number;
  canvasHeight: number;
  brandId: BrandId;
  /** Scale factor for zoom (1 = fit to canvas, 2 = 2x zoom, etc.) */
  scale?: number;
}

function getBeadCode(beadId: string, brandId: BrandId): string {
  const bead = BEAD_LIBRARY.find((b) => b.id === beadId);
  if (!bead) return "";
  return bead.codes[brandId];
}

export function renderBeadGrid(params: RenderGridParams): void {
  const { ctx, grid, options, canvasWidth, canvasHeight, brandId, scale = 1 } = params;
  const { pixelSize, pixels } = grid;

  // Pure white background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Margins for number labels
  const rowLabelW = 36;
  const colLabelH = 24;

  // Calculate cell size based on available space and zoom
  const availW = canvasWidth - rowLabelW;
  const availH = canvasHeight - colLabelH;
  const baseCell = Math.floor(Math.min(availW, availH) / pixelSize);
  const cellSize = Math.max(1, Math.floor(baseCell * scale));

  const gridW = cellSize * pixelSize;
  const gridH = cellSize * pixelSize;

  // Center the zoomed grid
  const gridX = rowLabelW + Math.floor((availW - gridW) / 2);
  const gridY = colLabelH + Math.floor((availH - gridH) / 2);

  // ─── Column labels ───
  if (cellSize >= 10) {
    ctx.fillStyle = "#333333";
    ctx.font = `bold ${Math.min(10, cellSize * 0.48)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let col = 0; col < pixelSize; col++) {
      const cx = gridX + col * cellSize + cellSize / 2;
      const cy = colLabelH / 2;
      ctx.fillText(columnLabel(col), cx, cy);
    }
  }

  // ─── Row labels ───
  if (cellSize >= 10) {
    for (let row = 0; row < pixelSize; row++) {
      const cx = rowLabelW / 2;
      const cy = gridY + row * cellSize + cellSize / 2;
      ctx.fillText(`${row + 1}`, cx, cy);
    }
  }

  // ─── Draw square beads ───
  // Zero gap — beads fill entire cell
  for (let row = 0; row < pixelSize; row++) {
    for (let col = 0; col < pixelSize; col++) {
      const x = gridX + col * cellSize;
      const y = gridY + row * cellSize;
      const beadId = pixels[row][col].matchedBeadId;
      const bead = BEAD_LIBRARY.find((b) => b.id === beadId);
      if (!bead) continue;

      // Fill bead color — use the full cell
      ctx.fillStyle = bead.hex;
      ctx.fillRect(x, y, cellSize, cellSize);

      // Dark outline for every bead — this creates the grid naturally
      if (cellSize > 2) {
        ctx.strokeStyle = "rgba(0,0,0,0.35)";
        ctx.lineWidth = Math.max(0.5, cellSize * 0.06);
        ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
      }

      // ─── Bead code label ───
      if (options.showNumbers && cellSize >= 18) {
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        const code = getBeadCode(beadId, brandId);

        const brightness = (bead.rgb.r * 299 + bead.rgb.g * 587 + bead.rgb.b * 114) / 1000;
        ctx.fillStyle = brightness > 140 ? "#1A1A1A" : "#FFFFFF";
        ctx.font = `bold ${Math.max(8, Math.floor(cellSize * 0.42))}px system-ui, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(code, cx, cy);
      }
    }
  }

  // ─── Grid lines (overlay on top of beads) ───
  if (options.showGridLines && cellSize >= 6) {
    ctx.strokeStyle = options.gridLineColor;
    ctx.lineWidth = options.gridLineWidth;
    ctx.beginPath();
    for (let col = 0; col <= pixelSize; col++) {
      const x = gridX + col * cellSize;
      ctx.moveTo(x, gridY);
      ctx.lineTo(x, gridY + gridH);
    }
    for (let row = 0; row <= pixelSize; row++) {
      const y = gridY + row * cellSize;
      ctx.moveTo(gridX, y);
      ctx.lineTo(gridX + gridW, y);
    }
    ctx.stroke();
  }

  // Outer border
  ctx.strokeStyle = "#666666";
  ctx.lineWidth = 2;
  ctx.strokeRect(gridX, gridY, gridW, gridH);
}
