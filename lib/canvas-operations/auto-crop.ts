/**
 * Auto-crop image to its main subject by detecting background color
 * from edge pixels and finding the bounding box of non-background content.
 */

interface CropBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Find the bounding box of subject content in image data.
 * Samples edge pixels to determine background, then scans for content.
 */
export function findSubjectBounds(imageData: ImageData): CropBox | null {
  const { data, width, height } = imageData;

  // Sample edge pixels (1px from each edge) to determine background color
  const edgeSamples: number[][] = [];
  const edgeThickness = 3;

  // Top edge
  for (let y = 0; y < edgeThickness; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      edgeSamples.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  // Bottom edge
  for (let y = height - edgeThickness; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      edgeSamples.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  // Left edge (excluding top/bottom overlap)
  for (let y = edgeThickness; y < height - edgeThickness; y++) {
    for (let x = 0; x < edgeThickness; x++) {
      const i = (y * width + x) * 4;
      edgeSamples.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  // Right edge
  for (let y = edgeThickness; y < height - edgeThickness; y++) {
    for (let x = width - edgeThickness; x < width; x++) {
      const i = (y * width + x) * 4;
      edgeSamples.push([data[i], data[i + 1], data[i + 2]]);
    }
  }

  // Find dominant background color (median of edge samples)
  const bgColor = medianColor(edgeSamples);
  const tolerance = 40; // color distance tolerance for "background"

  // Scan inward from each edge to find content boundaries
  let left = 0;
  let top = 0;
  let right = width;
  let bottom = height;

  // Left → right
  for (let x = 0; x < width; x++) {
    if (columnHasContent(data, width, height, x, bgColor, tolerance)) {
      left = x;
      break;
    }
  }

  // Right → left
  for (let x = width - 1; x >= 0; x--) {
    if (columnHasContent(data, width, height, x, bgColor, tolerance)) {
      right = x + 1;
      break;
    }
  }

  // Top → bottom
  for (let y = 0; y < height; y++) {
    if (rowHasContent(data, width, height, y, bgColor, tolerance)) {
      top = y;
      break;
    }
  }

  // Bottom → top
  for (let y = height - 1; y >= 0; y--) {
    if (rowHasContent(data, width, height, y, bgColor, tolerance)) {
      bottom = y + 1;
      break;
    }
  }

  // Add padding
  const pad = Math.max(1, Math.floor(Math.min(right - left, bottom - top) * 0.03));
  left = Math.max(0, left - pad);
  top = Math.max(0, top - pad);
  right = Math.min(width, right + pad);
  bottom = Math.min(height, bottom + pad);

  const cropW = right - left;
  const cropH = bottom - top;

  // Don't crop if the subject takes up >90% of the image already
  const totalArea = width * height;
  const cropArea = cropW * cropH;
  if (cropArea > totalArea * 0.85) {
    return null;
  }

  // Don't crop if the result would be too small
  if (cropW < 16 || cropH < 16) {
    return null;
  }

  return { left, top, right, bottom };
}

/**
 * Crop image data to the given bounding box.
 */
export function cropToBox(
  imageData: ImageData,
  box: CropBox
): { imageData: ImageData; offsetX: number; offsetY: number } {
  const { left, top, right, bottom } = box;
  const cropW = right - left;
  const cropH = bottom - top;

  const canvas = document.createElement("canvas");
  canvas.width = cropW;
  canvas.height = cropH;
  const ctx = canvas.getContext("2d")!;

  // Draw the source ImageData onto a temp canvas first
  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = imageData.width;
  srcCanvas.height = imageData.height;
  const srcCtx = srcCanvas.getContext("2d")!;
  srcCtx.putImageData(imageData, 0, 0);

  // Draw cropped region
  ctx.drawImage(srcCanvas, left, top, cropW, cropH, 0, 0, cropW, cropH);

  return {
    imageData: ctx.getImageData(0, 0, cropW, cropH),
    offsetX: left,
    offsetY: top,
  };
}

// ─── helpers ───

function colorDist(a: number[], b: number[]): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
  );
}

function medianColor(samples: number[][]): number[] {
  const rs = samples.map((s) => s[0]).sort((a, b) => a - b);
  const gs = samples.map((s) => s[1]).sort((a, b) => a - b);
  const bs = samples.map((s) => s[2]).sort((a, b) => a - b);
  const mid = Math.floor(samples.length / 2);
  return [rs[mid], gs[mid], bs[mid]];
}

function columnHasContent(
  data: Uint8ClampedArray,
  width: number,
  _height: number,
  col: number,
  bgColor: number[],
  tolerance: number
): boolean {
  // Sample every few rows for performance
  const step = Math.max(1, Math.floor(_height / 20));
  let contentPixels = 0;
  let sampled = 0;

  for (let y = 0; y < _height; y += step) {
    const i = (y * width + col) * 4;
    const px = [data[i], data[i + 1], data[i + 2]];
    if (colorDist(px, bgColor) > tolerance) {
      contentPixels++;
    }
    sampled++;
  }

  // At least 15% of sampled pixels must be non-background
  return contentPixels / sampled > 0.15;
}

function rowHasContent(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  row: number,
  bgColor: number[],
  tolerance: number
): boolean {
  const step = Math.max(1, Math.floor(width / 20));
  let contentPixels = 0;
  let sampled = 0;

  for (let x = 0; x < width; x += step) {
    const i = (row * width + x) * 4;
    const px = [data[i], data[i + 1], data[i + 2]];
    if (colorDist(px, bgColor) > tolerance) {
      contentPixels++;
    }
    sampled++;
  }

  return contentPixels / sampled > 0.15;
}
