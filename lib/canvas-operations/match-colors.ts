import type { BeadColor, BeadPixel, RGB, BlueprintGrid } from "../types";
import { matchAllPixels, findNearestBead } from "../color-matcher";
import { BEAD_LIBRARY } from "../bead-library";

/**
 * Convert pixelated ImageData into a BlueprintGrid by matching
 * each pixel to the nearest perler bead color.
 */
export function matchColors(
  imageData: ImageData,
  pixelSize: number
): BlueprintGrid {
  const beadIds = matchAllPixels(imageData.data, BEAD_LIBRARY);
  const beadMap = new Map(BEAD_LIBRARY.map((b) => [b.id, b]));

  const pixels: BeadPixel[][] = [];

  for (let row = 0; row < pixelSize; row++) {
    const rowPixels: BeadPixel[] = [];
    for (let col = 0; col < pixelSize; col++) {
      const idx = (row * pixelSize + col) * 4;
      const sourceRGB: RGB = {
        r: imageData.data[idx],
        g: imageData.data[idx + 1],
        b: imageData.data[idx + 2],
      };
      const beadId = beadIds[row * pixelSize + col];

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
    pixelSize,
    width: pixelSize,
    height: pixelSize,
    pixels,
  };
}
