/**
 * "Smart Optimize" — two-pass image enhancement applied before pixelation.
 *
 * Pass A: 3×3 Median Filter (noise reduction)
 *   Removes JPEG artifacts and sensor noise while preserving edges.
 *
 * Pass B: Unsharp Mask (edge enhancement)
 *   Recovers edge crispness lost during noise reduction.
 */

function medianFilter(source: ImageData): ImageData {
  const { width, height, data } = source;
  const result = new Uint8ClampedArray(data.length);
  const w = width;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        // Collect 3×3 neighborhood for this channel
        const neighbors: number[] = [];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const idx = ((y + dy) * w + (x + dx)) * 4 + c;
            neighbors.push(data[idx]);
          }
        }
        neighbors.sort((a, b) => a - b);
        const idx = (y * w + x) * 4 + c;
        result[idx] = neighbors[4]; // median
      }
      // Copy alpha
      result[(y * w + x) * 4 + 3] = data[(y * w + x) * 4 + 3];
    }
  }

  // Copy border pixels unchanged
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < w; x++) {
      if (x === 0 || x === w - 1 || y === 0 || y === height - 1) {
        const idx = (y * w + x) * 4;
        result[idx] = data[idx];
        result[idx + 1] = data[idx + 1];
        result[idx + 2] = data[idx + 2];
        result[idx + 3] = data[idx + 3];
      }
    }
  }

  return new ImageData(result, width, height);
}

function boxBlur(source: ImageData): ImageData {
  const { width, height, data } = source;
  const result = new Uint8ClampedArray(data.length);
  const w = width;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            sum += data[((y + dy) * w + (x + dx)) * 4 + c];
          }
        }
        result[(y * w + x) * 4 + c] = Math.round(sum / 9);
      }
      result[(y * w + x) * 4 + 3] = data[(y * w + x) * 4 + 3];
    }
  }

  // Copy borders
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < w; x++) {
      if (x === 0 || x === w - 1 || y === 0 || y === height - 1) {
        const idx = (y * w + x) * 4;
        result[idx] = data[idx];
        result[idx + 1] = data[idx + 1];
        result[idx + 2] = data[idx + 2];
        result[idx + 3] = data[idx + 3];
      }
    }
  }

  return new ImageData(result, width, height);
}

function unsharpMask(source: ImageData, amount = 0.3): ImageData {
  const blurred = boxBlur(source);
  const result = new Uint8ClampedArray(source.data.length);

  for (let i = 0; i < source.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const original = source.data[i + c];
      const blur = blurred.data[i + c];
      const sharpened = original + amount * (original - blur);
      result[i + c] = Math.max(0, Math.min(255, Math.round(sharpened)));
    }
    result[i + 3] = source.data[i + 3];
  }

  return new ImageData(result, source.width, source.height);
}

/**
 * Apply smart optimization pipeline: median filter → unsharp mask.
 * Only call for photographic source images; skip for clean pixel art.
 */
export function smartOptimize(imageData: ImageData): ImageData {
  const denoised = medianFilter(imageData);
  return unsharpMask(denoised, 0.3);
}
