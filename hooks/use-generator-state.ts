"use client";

import { useReducer, useCallback, useRef, useEffect } from "react";
import type { GeneratorState, GeneratorAction } from "@/lib/types";
import { DEFAULT_PIXEL_WIDTH, DEFAULT_PIXEL_HEIGHT, DEFAULT_BRAND, DEFAULT_GRID_OPTIONS, DEFAULT_EXPORT_OPTIONS, PROCESSING_DEBOUNCE_MS } from "@/lib/constants";
import { runPipeline } from "@/lib/canvas-pipeline";
import { clearMatchCache } from "@/lib/color-matcher";

const initialState: GeneratorState = {
  phase: "idle",
  sourceImage: null,
  sourceImageData: null,
  pixelWidth: DEFAULT_PIXEL_WIDTH,
  pixelHeight: DEFAULT_PIXEL_HEIGHT,
  smartOptimize: false,
  dither: true,
  brandId: DEFAULT_BRAND,
  blueprint: null,
  statistics: null,
  gridOptions: { ...DEFAULT_GRID_OPTIONS },
  exportOptions: { ...DEFAULT_EXPORT_OPTIONS },
  error: null,
};

/** Auto-compute pixel dimensions preserving image aspect ratio */
function autoDimensions(imageData: ImageData): { width: number; height: number } {
  const { width: w, height: h } = imageData;
  // Scale target size based on image resolution: smaller images get smaller grids
  const maxDim = Math.max(w, h);
  const target = maxDim > 1000 ? 64 : maxDim > 500 ? 48 : 32;

  if (w === h) return { width: target, height: target };

  if (w > h) {
    const cols = Math.min(target, 128);
    const rows = Math.max(8, Math.round(cols * (h / w)));
    return { width: cols, height: rows };
  } else {
    const rows = Math.min(target, 128);
    const cols = Math.max(8, Math.round(rows * (w / h)));
    return { width: cols, height: rows };
  }
}

function reducer(state: GeneratorState, action: GeneratorAction): GeneratorState {
  switch (action.type) {
    case "SET_IMAGE": {
      const dims = autoDimensions(action.payload.imageData);
      return {
        ...state,
        phase: "uploaded",
        sourceImage: action.payload.image,
        sourceImageData: action.payload.imageData,
        pixelWidth: dims.width,
        pixelHeight: dims.height,
        blueprint: null,
        statistics: null,
        error: null,
      };
    }
    case "SET_PIXEL_DIMENSIONS":
      return {
        ...state,
        pixelWidth: action.payload.width,
        pixelHeight: action.payload.height,
      };
    case "TOGGLE_SMART_OPTIMIZE":
      return { ...state, smartOptimize: !state.smartOptimize };
    case "TOGGLE_DITHER":
      return { ...state, dither: !state.dither };
    case "SET_BRAND":
      return { ...state, brandId: action.payload };
    case "SET_PROCESSING":
      return { ...state, phase: "processing", error: null };
    case "SET_BLUEPRINT":
      return {
        ...state,
        phase: "ready",
        blueprint: action.payload.blueprint,
        statistics: action.payload.statistics,
        error: null,
      };
    case "SET_GRID_OPTIONS":
      return { ...state, gridOptions: { ...state.gridOptions, ...action.payload } };
    case "SET_EXPORT_OPTIONS":
      return { ...state, exportOptions: { ...state.exportOptions, ...action.payload } };
    case "SET_ERROR":
      return { ...state, phase: "idle", error: action.payload };
    case "RESET":
      clearMatchCache();
      return { ...initialState, brandId: state.brandId };
    default:
      return state;
  }
}

export function useGeneratorState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const stateRef = useRef(state);
  stateRef.current = state;

  const prevPixelWidth = useRef(state.pixelWidth);
  const prevPixelHeight = useRef(state.pixelHeight);
  const prevSmartOptimize = useRef(state.smartOptimize);
  const prevDither = useRef(state.dither);
  const prevBrandId = useRef(state.brandId);

  const processImage = useCallback(async () => {
    const current = stateRef.current;
    if (!current.sourceImage || !current.sourceImageData) return;

    dispatch({ type: "SET_PROCESSING" });

    try {
      const result = await runPipeline(current);
      dispatch({ type: "SET_BLUEPRINT", payload: result });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "处理失败",
      });
    }
  }, []);

  const triggerProcessing = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      processImage();
    }, PROCESSING_DEBOUNCE_MS);
  }, [processImage]);

  // Initial processing on upload
  useEffect(() => {
    if (state.phase === "uploaded") {
      processImage();
    }
  }, [state.phase, processImage]);

  // Reprocess only when settings actually change
  useEffect(() => {
    if (state.phase !== "ready") return;

    const sizeChanged =
      prevPixelWidth.current !== state.pixelWidth ||
      prevPixelHeight.current !== state.pixelHeight;
    const optChanged = prevSmartOptimize.current !== state.smartOptimize;
    const ditherChanged = prevDither.current !== state.dither;
    const brandChanged = prevBrandId.current !== state.brandId;

    if (sizeChanged || optChanged || ditherChanged || brandChanged) {
      prevPixelWidth.current = state.pixelWidth;
      prevPixelHeight.current = state.pixelHeight;
      prevSmartOptimize.current = state.smartOptimize;
      prevDither.current = state.dither;
      prevBrandId.current = state.brandId;
      triggerProcessing();
    }
  }, [state.pixelWidth, state.pixelHeight, state.smartOptimize, state.dither, state.brandId, state.phase, triggerProcessing]);

  // Reset tracking refs on new image
  useEffect(() => {
    if (state.phase === "uploaded") {
      prevPixelWidth.current = state.pixelWidth;
      prevPixelHeight.current = state.pixelHeight;
      prevSmartOptimize.current = state.smartOptimize;
      prevDither.current = state.dither;
      prevBrandId.current = state.brandId;
    }
  }, [state.phase, state.pixelWidth, state.pixelHeight, state.smartOptimize, state.dither, state.brandId]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { state, dispatch, processImage };
}
