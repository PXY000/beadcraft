import type { BeadPixel, RGB, BlueprintGrid } from "../types";
import { matchAllPixels } from "../color-matcher";
import { BEAD_LIBRARY } from "../bead-library";

/**
 * Convert pixelated ImageData into a BlueprintGrid by matching
 * each pixel to the nearest perler bead color.
 */
export function matchColors(
  imageData: ImageData,
  pixelWidth: number,
  pixelHeight: number
): BlueprintGrid {
  const beadIds = matchAllPixels(imageData.data, BEAD_LIBRARY);

  const pixels: BeadPixel[][] = [];

  for (let row = 0; row < pixelHeight; row++) {
    const rowPixels: BeadPixel[] = [];
    for (let col = 0; col < pixelWidth; col++) {
      const idx = (row * pixelWidth + col) * 4;
      const sourceRGB: RGB = {
        r: imageData.data[idx],
        g: imageData.data[idx + 1],
        b: imageData.data[idx + 2],
      };
      const beadId = beadIds[row * pixelWidth + col];

      rowPixels.push({
        row,
        col,
        sourceRGB,
        matchedBeadId: beadId,
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
