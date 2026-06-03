/**
 * Pixelate an image by downscaling to target size then upscaling back.
 * Uses nearest-neighbor interpolation for crisp pixel edges.
 */
export function pixelate(
  sourceImage: HTMLImageElement,
  targetSize: number
): ImageData {
  // Step 1: Downscale to target size
  const small = document.createElement("canvas");
  small.width = targetSize;
  small.height = targetSize;
  const smallCtx = small.getContext("2d")!;
  smallCtx.imageSmoothingEnabled = false;
  smallCtx.drawImage(sourceImage, 0, 0, targetSize, targetSize);

  return smallCtx.getImageData(0, 0, targetSize, targetSize);
}

/**
 * Create a pixelated preview image (upscaled for display).
 * Each pixel becomes blockSize×blockSize in the output.
 */
export function pixelateToCanvas(
  sourceImage: HTMLImageElement,
  targetSize: number,
  outputCanvas: HTMLCanvasElement,
  blockSize: number
): void {
  outputCanvas.width = targetSize * blockSize;
  outputCanvas.height = targetSize * blockSize;
  const ctx = outputCanvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sourceImage, 0, 0, targetSize, targetSize);
  // Scale up
  ctx.drawImage(
    outputCanvas,
    0, 0, targetSize, targetSize,
    0, 0, targetSize * blockSize, targetSize * blockSize
  );
}
