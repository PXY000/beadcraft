import type { BlueprintGrid, BlueprintStatistics, BeadStats } from "./types";
import { BEAD_LIBRARY, BEAD_MAP } from "./bead-library";

export function computeStatistics(grid: BlueprintGrid): BlueprintStatistics {
  const counts = new Map<string, number>();

  for (const row of grid.pixels) {
    for (const pixel of row) {
      const id = pixel.matchedBeadId;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  const beadCounts: BeadStats[] = BEAD_LIBRARY.map((bead) => {
    const count = counts.get(bead.id) ?? 0;
    return {
      bead,
      count,
      percentage: grid.pixelSize * grid.pixelSize > 0
        ? (count / (grid.pixelSize * grid.pixelSize)) * 100
        : 0,
    };
  });

  // Sort descending by count
  beadCounts.sort((a, b) => b.count - a.count);

  return {
    totalBeads: grid.pixelSize * grid.pixelSize,
    beadCounts,
    dimensions: { cols: grid.width, rows: grid.height },
  };
}
