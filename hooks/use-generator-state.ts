"use client";

import { useReducer, useCallback, useRef, useEffect } from "react";
import type { GeneratorState, GeneratorAction } from "@/lib/types";
import { DEFAULT_PIXEL_SIZE, DEFAULT_BRAND, DEFAULT_GRID_OPTIONS, DEFAULT_EXPORT_OPTIONS, PROCESSING_DEBOUNCE_MS } from "@/lib/constants";
import { runPipeline } from "@/lib/canvas-pipeline";
import { clearMatchCache } from "@/lib/color-matcher";

const initialState: GeneratorState = {
  phase: "idle",
  sourceImage: null,
  sourceImageData: null,
  pixelSize: DEFAULT_PIXEL_SIZE,
  smartOptimize: true,
  brandId: DEFAULT_BRAND,
  blueprint: null,
  statistics: null,
  gridOptions: { ...DEFAULT_GRID_OPTIONS },
  exportOptions: { ...DEFAULT_EXPORT_OPTIONS },
  error: null,
};

function reducer(state: GeneratorState, action: GeneratorAction): GeneratorState {
  switch (action.type) {
    case "SET_IMAGE":
      return {
        ...state,
        phase: "uploaded",
        sourceImage: action.payload.image,
        sourceImageData: action.payload.imageData,
        blueprint: null,
        statistics: null,
        error: null,
      };
    case "SET_PIXEL_SIZE":
      return { ...state, pixelSize: action.payload };
    case "TOGGLE_SMART_OPTIMIZE":
      return { ...state, smartOptimize: !state.smartOptimize };
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
      return { ...initialState, brandId: state.brandId }; // keep brand selection
    default:
      return state;
  }
}

export function useGeneratorState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const stateRef = useRef(state);
  stateRef.current = state;

  const prevPixelSize = useRef(state.pixelSize);
  const prevSmartOptimize = useRef(state.smartOptimize);
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

    const sizeChanged = prevPixelSize.current !== state.pixelSize;
    const optChanged = prevSmartOptimize.current !== state.smartOptimize;
    const brandChanged = prevBrandId.current !== state.brandId;

    if (sizeChanged || optChanged || brandChanged) {
      prevPixelSize.current = state.pixelSize;
      prevSmartOptimize.current = state.smartOptimize;
      prevBrandId.current = state.brandId;
      triggerProcessing();
    }
  }, [state.pixelSize, state.smartOptimize, state.brandId, state.phase, triggerProcessing]);

  // Reset tracking refs on new image
  useEffect(() => {
    if (state.phase === "uploaded") {
      prevPixelSize.current = state.pixelSize;
      prevSmartOptimize.current = state.smartOptimize;
      prevBrandId.current = state.brandId;
    }
  }, [state.phase, state.pixelSize, state.smartOptimize, state.brandId]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { state, dispatch, processImage };
}
