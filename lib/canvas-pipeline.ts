import type { BlueprintGrid, BlueprintStatistics, GeneratorState } from "./types";
import { loadImage, cropToSquare } from "./canvas-operations/load-image";
import { pixelate } from "./canvas-operations/pixelate";
import { matchColors } from "./canvas-operations/match-colors";
import { smartOptimize } from "./canvas-operations/smart-optimize";
import { computeStatistics } from "./statistics";

export interface PipelineResult {
  blueprint: BlueprintGrid;
  statistics: BlueprintStatistics;
}

/**
 * Full processing pipeline:
 * 1. Crop source image to square
 * 2. Apply smart optimize (if enabled)
 * 3. Pixelate to target size
 * 4. Match colors to bead library
 * 5. Compute statistics
 */
export async function runPipeline(
  state: GeneratorState
): Promise<PipelineResult> {
  const { sourceImage, sourceImageData, pixelSize, smartOptimize: optimize } = state;
  if (!sourceImage || !sourceImageData) {
    throw new Error("No image loaded");
  }

  // Step 1: Crop to square
  const squareData = cropToSquare(sourceImageData);

  // Create a temporary image from the square data for pixelation
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = squareData.width;
  tempCanvas.height = squareData.height;
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.putImageData(squareData, 0, 0);

  const squareImage = new Image();
  await new Promise<void>((resolve, reject) => {
    squareImage.onload = () => resolve();
    squareImage.onerror = () => reject(new Error("Failed to create squared image"));
    squareImage.src = tempCanvas.toDataURL();
  });

  // Step 2: Smart optimize (optional)
  let workingData = squareData;
  if (optimize) {
    workingData = smartOptimize(squareData);

    // Update temp canvas with optimized data
    tempCtx.putImageData(workingData, 0, 0);
    const optimizedImage = new Image();
    await new Promise<void>((resolve, reject) => {
      optimizedImage.onload = () => resolve();
      optimizedImage.onerror = () => reject(new Error("Failed to create optimized image"));
      optimizedImage.src = tempCanvas.toDataURL();
    });
    // Use optimized image for pixelation
    const pixelated = pixelate(optimizedImage, pixelSize);
    const grid = matchColors(pixelated, pixelSize);
    const statistics = computeStatistics(grid);
    return { blueprint: grid, statistics };
  }

  // Step 3: Pixelate
  const pixelated = pixelate(squareImage, pixelSize);

  // Step 4: Match colors
  const grid = matchColors(pixelated, pixelSize);

  // Step 5: Statistics
  const statistics = computeStatistics(grid);

  return { blueprint: grid, statistics };
}
