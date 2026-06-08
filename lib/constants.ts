import type { BrandId } from "./types";

// Expanded pixel sizes for more creative control
export const PIXEL_SIZES = [16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64] as const;
export type PixelSize = (typeof PIXEL_SIZES)[number];

export const DEFAULT_PIXEL_WIDTH = 32;
export const DEFAULT_PIXEL_HEIGHT = 32;
export const DEFAULT_BRAND: BrandId = "mard";

export const DEFAULT_GRID_OPTIONS = {
  showGridLines: true,
  gridLineColor: "rgba(255,255,255,0.15)",
  gridLineWidth: 1,
  showNumbers: true,
  numberColor: "rgba(255,255,255,0.4)",
  numberFontSize: 10,
};

export const DEFAULT_EXPORT_OPTIONS = {
  beadPixelSize: 28,
  showGrid: true,
  showNumbers: true,
  includeLegend: true,
  includeStats: true,
};

export const MAX_IMAGE_DIMENSION = 4096;
export const MIN_IMAGE_DIMENSION = 16;
export const PROCESSING_DEBOUNCE_MS = 300;

// Pure number labels for both rows and columns
export function columnLabel(index: number): string {
  return `${index + 1}`;
}
