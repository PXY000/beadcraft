import type { BlueprintGrid, BlueprintStatistics, BeadStats } from "./types";
import { BEAD_LIBRARY } from "./bead-library";

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
      percentage: grid.width * grid.height > 0
        ? (count / (grid.width * grid.height)) * 100
        : 0,
    };
  });

  // Sort descending by count
  beadCounts.sort((a, b) => b.count - a.count);

  return {
    totalBeads: grid.width * grid.height,
    beadCounts,
    dimensions: { cols: grid.width, rows: grid.height },
  };
}
