import type { BlueprintGrid, BlueprintStatistics, GeneratorState } from "./types";
import { pixelate } from "./canvas-operations/pixelate";
import { matchColors } from "./canvas-operations/match-colors";
import { smartOptimize } from "./canvas-operations/smart-optimize";
import { computeStatistics } from "./statistics";
import { findSubjectBounds, cropToBox } from "./canvas-operations/auto-crop";
import { ditherAndMatch } from "./canvas-operations/dither";

export interface PipelineResult {
  blueprint: BlueprintGrid;
  statistics: BlueprintStatistics;
}

/**
 * Full processing pipeline:
 * 1. Auto-crop to subject (detect background, trim edges)
 * 2. Apply smart optimize (if enabled)
 * 3. Recalculate pixel dimensions to match cropped aspect ratio
 * 4. Pixelate to target size
 * 5. Match colors to bead library
 * 6. Compute statistics
 */
export async function runPipeline(
  state: GeneratorState
): Promise<PipelineResult> {
  const { sourceImage, sourceImageData, pixelWidth, pixelHeight, smartOptimize: optimize, dither } = state;
  if (!sourceImage || !sourceImageData) {
    throw new Error("No image loaded");
  }

  // Create a working canvas from the source
  const tempCanvas = document.createElement("canvas");
  let workingData = sourceImageData;
  let workingWidth = sourceImageData.width;
  let workingHeight = sourceImageData.height;

  tempCanvas.width = workingWidth;
  tempCanvas.height = workingHeight;
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.putImageData(workingData, 0, 0);

  // Step 1: Auto-crop to subject
  const bounds = findSubjectBounds(workingData);
  let targetW = pixelWidth;
  let targetH = pixelHeight;

  if (bounds) {
    const cropped = cropToBox(workingData, bounds);
    workingData = cropped.imageData;
    workingWidth = workingData.width;
    workingHeight = workingData.height;

    tempCanvas.width = workingWidth;
    tempCanvas.height = workingHeight;
    tempCtx.putImageData(workingData, 0, 0);

    // Recalculate pixel dimensions to maintain aspect ratio of cropped subject
    const aspectRatio = workingWidth / workingHeight;
    const maxDim = Math.max(pixelWidth, pixelHeight);
    if (aspectRatio >= 1) {
      targetW = Math.min(maxDim, 128);
      targetH = Math.max(8, Math.round(targetW / aspectRatio));
    } else {
      targetH = Math.min(maxDim, 128);
      targetW = Math.max(8, Math.round(targetH * aspectRatio));
    }
  }

  // Step 2: Smart optimize (optional)
  let workingImage = new Image();
  if (optimize) {
    const optimized = smartOptimize(workingData);
    tempCtx.putImageData(optimized, 0, 0);
  }
  await new Promise<void>((resolve, reject) => {
    workingImage.onload = () => resolve();
    workingImage.onerror = () => reject(new Error("Failed to create working image"));
    workingImage.src = tempCanvas.toDataURL();
  });

  // Step 3: Pixelate to target dimensions
  const pixelated = pixelate(workingImage, targetW, targetH);

  // Step 4: Match colors (with optional dithering)
  const grid = dither
    ? ditherAndMatch(pixelated, targetW, targetH)
    : matchColors(pixelated, targetW, targetH);

  // Step 5: Statistics
  const statistics = computeStatistics(grid);

  return { blueprint: grid, statistics };
}
