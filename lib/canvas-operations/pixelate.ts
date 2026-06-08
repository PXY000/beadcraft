/**
 * Pixelate an image by downscaling to target size then upscaling back.
 * Uses nearest-neighbor interpolation for crisp pixel edges.
 */
export function pixelate(
  sourceImage: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): ImageData {
  const small = document.createElement("canvas");
  small.width = targetWidth;
  small.height = targetHeight;
  const smallCtx = small.getContext("2d")!;
  smallCtx.imageSmoothingEnabled = false;
  smallCtx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);

  return smallCtx.getImageData(0, 0, targetWidth, targetHeight);
}

/**
 * Create a pixelated preview image (upscaled for display).
 * Each pixel becomes blockSize×blockSize in the output.
 */
export function pixelateToCanvas(
  sourceImage: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  outputCanvas: HTMLCanvasElement,
  blockSize: number
): void {
  outputCanvas.width = targetWidth * blockSize;
  outputCanvas.height = targetHeight * blockSize;
  const ctx = outputCanvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);
  // Scale up
  ctx.drawImage(
    outputCanvas,
    0, 0, targetWidth, targetHeight,
    0, 0, targetWidth * blockSize, targetHeight * blockSize
  );
}
