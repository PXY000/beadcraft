/**
 * CIEDE2000 color difference algorithm — industry standard for perceptual color matching.
 * Significantly more accurate than RGB Euclidean distance, especially for:
 * - Similar colors (e.g., distinguishing navy from dark blue)
 * - Saturated colors (reds, oranges)
 * - Near-neutral colors (greys, whites)
 *
 * Reference: CIE 142-2001, Sharma et al. 2005
 * Ported from BeadForge (MIT License)
 */

// sRGB → linear RGB
function srgbToLinear(v: number): number {
  v /= 255;
  return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
}

// linear RGB → CIE XYZ → CIE Lab
export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const rl = srgbToLinear(r);
  const gl = srgbToLinear(g);
  const bl = srgbToLinear(b);

  // RGB → XYZ (D65)
  let x = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) / 0.95047;
  let y = (rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750) / 1.00000;
  let z = (rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041) / 1.08883;

  // XYZ → Lab
  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

// Full CIEDE2000 delta-E
export function ciede2000(lab1: [number, number, number], lab2: [number, number, number]): number {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cab = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cab, 7) / (Math.pow(Cab, 7) + Math.pow(25, 7))));

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);

  let h1p = (Math.atan2(b1, a1p) * 180) / Math.PI;
  let h2p = (Math.atan2(b2, a2p) * 180) / Math.PI;
  if (h1p < 0) h1p += 360;
  if (h2p < 0) h2p += 360;

  const dLp = L2 - L1;
  const dCp = C2p - C1p;

  let dhp: number;
  if (C1p * C2p === 0) {
    dhp = 0;
  } else if (Math.abs(h2p - h1p) <= 180) {
    dhp = h2p - h1p;
  } else if (h2p - h1p > 180) {
    dhp = h2p - h1p - 360;
  } else {
    dhp = h2p - h1p + 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 360);

  const Lbp = (L1 + L2) / 2;
  const Cbp = (C1p + C2p) / 2;

  let hbp: number;
  if (C1p * C2p === 0) {
    hbp = h1p + h2p;
  } else if (Math.abs(h1p - h2p) <= 180) {
    hbp = (h1p + h2p) / 2;
  } else if (h1p + h2p < 360) {
    hbp = (h1p + h2p + 360) / 2;
  } else {
    hbp = (h1p + h2p - 360) / 2;
  }

  const T =
    1 -
    0.17 * Math.cos(((hbp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hbp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hbp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * hbp - 63) * Math.PI) / 180);

  const SL = 1 + (0.015 * Math.pow(Lbp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbp - 50, 2));
  const SC = 1 + 0.045 * Cbp;
  const SH = 1 + 0.015 * Cbp * T;
  const RT =
    -Math.sin(((2 * (hbp - 27.5)) * Math.PI) / 180) *
    2 *
    30 *
    Math.exp(-Math.pow((hbp - 275) / 25, 2));
  const RC = Math.sqrt(Math.pow(Cbp, 7) / (Math.pow(Cbp, 7) + Math.pow(25, 7)));

  return Math.sqrt(
    Math.pow(dLp / SL, 2) +
      Math.pow(dCp / SC, 2) +
      Math.pow(dHp / SH, 2) +
      RT * RC * (dHp / SH)
  );
}

// ─── Lab Cache ───────────────────────────────────────────
const LAB_CACHE = new Map<string, [number, number, number]>();

export function getCachedLab(hex: string): [number, number, number] {
  const cached = LAB_CACHE.get(hex);
  if (cached) return cached;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lab = rgbToLab(r, g, b);
  LAB_CACHE.set(hex, lab);
  return lab;
}
