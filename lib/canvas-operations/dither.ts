/**
 * Floyd-Steinberg error diffusion dithering for bead color matching.
 *
 * Instead of naively snapping each pixel to the nearest bead color
 * (which causes banding and detail loss), this algorithm distributes
 * the quantization error to neighboring pixels. The result is that
 * adjacent pixels "compensate" for each other, preserving visual
 * detail and smooth gradients within a limited 221-color palette.
 *
 * Reference: Floyd, R.W. & Steinberg, L. (1976)
 *   "An Adaptive Algorithm for Spatial Greyscale"
 */

import type { BeadColor, BeadPixel, RGB, BlueprintGrid } from "../types";
import { findNearestBead } from "../color-matcher";
import { BEAD_LIBRARY } from "../bead-library";

/**
 * Apply Floyd-Steinberg dithering to match pixelated image data to
 * the bead color library. Uses serpentine (boustrophedon) scanning
 * to reduce directional artifacts.
 */
export function ditherAndMatch(
  imageData: ImageData,
  pixelWidth: number,
  pixelHeight: number
): BlueprintGrid {
  const { data, width, height } = imageData;

  // Floating-point working buffer for error accumulation
  const bufR = new Float32Array(data.length / 4);
  const bufG = new Float32Array(data.length / 4);
  const bufB = new Float32Array(data.length / 4);

  // Initialize buffer from image data
  for (let i = 0; i < bufR.length; i++) {
    const j = i * 4;
    bufR[i] = data[j];
    bufG[i] = data[j + 1];
    bufB[i] = data[j + 2];
  }

  const pixels: BeadPixel[][] = [];
  const matchedIds: string[] = new Array(bufR.length);

  for (let row = 0; row < height; row++) {
    const rowPixels: BeadPixel[] = [];

    // Serpentine scan: even rows left→right, odd rows right→left
    const leftToRight = row % 2 === 0;
    const colStart = leftToRight ? 0 : width - 1;
    const colEnd = leftToRight ? width : -1;
    const colStep = leftToRight ? 1 : -1;

    for (let c = colStart; c !== colEnd; c += colStep) {
      const idx = row * width + c;

      // Clamp and get the dithered color
      const r = clamp(bufR[idx], 0, 255);
      const g = clamp(bufG[idx], 0, 255);
      const b = clamp(bufB[idx], 0, 255);

      // Find nearest bead
      const pixel: RGB = { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
      const nearest = findNearestBead(pixel, BEAD_LIBRARY);
      matchedIds[idx] = nearest.id;

      // Calculate quantization error
      const errR = r - nearest.rgb.r;
      const errG = g - nearest.rgb.g;
      const errB = b - nearest.rgb.b;

      // Distribute error to neighbors
      // Floyd-Steinberg kernel: 7/16 right, 3/16 down-left, 5/16 down, 1/16 down-right
      // Direction flips for serpentine scanning
      const dir = leftToRight ? 1 : -1;
      const rightIdx = idx + dir;
      const downIdx = idx + width;
      const downLeftIdx = downIdx - dir;
      const downRightIdx = downIdx + dir;

      if (c + dir >= 0 && c + dir < width) {
        distribute(bufR, rightIdx, errR, 7 / 16);
        distribute(bufG, rightIdx, errG, 7 / 16);
        distribute(bufB, rightIdx, errB, 7 / 16);
      }

      if (row + 1 < height) {
        if (c - dir >= 0 && c - dir < width) {
          distribute(bufR, downLeftIdx, errR, 3 / 16);
          distribute(bufG, downLeftIdx, errG, 3 / 16);
          distribute(bufB, downLeftIdx, errB, 3 / 16);
        }

        distribute(bufR, downIdx, errR, 5 / 16);
        distribute(bufG, downIdx, errG, 5 / 16);
        distribute(bufB, downIdx, errB, 5 / 16);

        if (c + dir >= 0 && c + dir < width) {
          distribute(bufR, downRightIdx, errR, 1 / 16);
          distribute(bufG, downRightIdx, errG, 1 / 16);
          distribute(bufB, downRightIdx, errB, 1 / 16);
        }
      }
    }

    // Build row pixels
    for (let col = 0; col < width; col++) {
      const idx = row * width + col;
      const j = idx * 4;
      rowPixels.push({
        row,
        col,
        sourceRGB: { r: data[j], g: data[j + 1], b: data[j + 2] },
        matchedBeadId: matchedIds[idx],
      });
    }
    pixels.push(rowPixels);
  }

  return {
    pixelSize: Math.max(pixelWidth, pixelHeight),
    width: pixelWidth,
    height: pixelHeight,
    pixels,
  };
}

function distribute(arr: Float32Array, idx: number, error: number, weight: number) {
  arr[idx] += error * weight;
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}
