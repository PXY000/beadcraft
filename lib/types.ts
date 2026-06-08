// ─── RGB Color ──────────────────────────────────────────────
export interface RGB {
  r: number;
  g: number;
  b: number;
}

// ─── Brand ─────────────────────────────────────────────────
export type BrandId = "mard" | "artkal" | "coco" | "manman" | "panpan";

export interface BrandInfo {
  id: BrandId;
  name: string;
  description: string;
}

export const BRANDS: BrandInfo[] = [
  { id: "mard", name: "MARD", description: "A-H,M前缀 221色，基准品牌" },
  { id: "artkal", name: "Artkal-C", description: "C系列 2.6mm 175色" },
  { id: "coco", name: "COCO", description: "A/B/C/D/E/K 174色" },
  { id: "manman", name: "漫漫", description: "IC前缀 128色" },
  { id: "panpan", name: "盼盼/咪小窝", description: "纯数字 101-322 222色" },
];

// ─── Bead Color ────────────────────────────────────────────
export type BeadCategory =
  | "neutral"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "brown"
  | "special";

export interface BeadColor {
  id: string;
  name: string;
  nameZh: string;
  /** Brand-specific color codes */
  codes: Record<BrandId, string>;
  rgb: RGB;
  hex: string;
  category: BeadCategory;
  special?: boolean;
  transparent?: boolean;
}

// ─── Blueprint Grid ────────────────────────────────────────
export interface BeadPixel {
  row: number;
  col: number;
  sourceRGB: RGB;
  matchedBeadId: string;
}

export interface BlueprintGrid {
  pixelSize: number;
  width: number;
  height: number;
  pixels: BeadPixel[][];
}

// ─── Statistics ─────────────────────────────────────────────
export interface BeadStats {
  bead: BeadColor;
  count: number;
  percentage: number;
}

export interface BlueprintStatistics {
  totalBeads: number;
  beadCounts: BeadStats[];
  dimensions: { cols: number; rows: number };
}

// ─── Grid Rendering Options ────────────────────────────────
export interface GridOptions {
  showGridLines: boolean;
  gridLineColor: string;
  gridLineWidth: number;
  showNumbers: boolean;
  numberColor: string;
  numberFontSize: number;
}

// ─── Export Options ────────────────────────────────────────
export interface ExportOptions {
  beadPixelSize: number;
  showGrid: boolean;
  showNumbers: boolean;
  includeLegend: boolean;
  includeStats: boolean;
}

// ─── Generator State ───────────────────────────────────────
export type GeneratorPhase = "idle" | "uploaded" | "processing" | "ready";

export interface GeneratorState {
  phase: GeneratorPhase;
  sourceImage: HTMLImageElement | null;
  sourceImageData: ImageData | null;
  pixelWidth: number;
  pixelHeight: number;
  smartOptimize: boolean;
  dither: boolean;
  brandId: BrandId;
  blueprint: BlueprintGrid | null;
  statistics: BlueprintStatistics | null;
  gridOptions: GridOptions;
  exportOptions: ExportOptions;
  error: string | null;
}

// ─── Actions ───────────────────────────────────────────────
export type GeneratorAction =
  | { type: "SET_IMAGE"; payload: { image: HTMLImageElement; imageData: ImageData } }
  | { type: "SET_PIXEL_DIMENSIONS"; payload: { width: number; height: number } }
  | { type: "TOGGLE_SMART_OPTIMIZE" }
  | { type: "TOGGLE_DITHER" }
  | { type: "SET_BRAND"; payload: BrandId }
  | { type: "SET_PROCESSING" }
  | { type: "SET_BLUEPRINT"; payload: { blueprint: BlueprintGrid; statistics: BlueprintStatistics } }
  | { type: "SET_GRID_OPTIONS"; payload: Partial<GridOptions> }
  | { type: "SET_EXPORT_OPTIONS"; payload: Partial<ExportOptions> }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET" };

// ─── Sample Showcase ───────────────────────────────────────
export interface Sample {
  id: string;
  title: string;
  description: string;
  pixelSize: number;
  beadCount: number;
  tags: string[];
  image?: string;
}
