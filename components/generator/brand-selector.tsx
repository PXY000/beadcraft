"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { BrandId } from "@/lib/types";
import { BRANDS } from "@/lib/types";
import { BEAD_LIBRARY } from "@/lib/bead-library";

interface BrandSelectorProps {
  value: BrandId;
  onChange: (brand: BrandId) => void;
  disabled?: boolean;
}

// Pick 6 representative colors per brand for the swatch preview
function getBrandPreviewColors(brandId: BrandId): string[] {
  const brandBeads = BEAD_LIBRARY.filter((b) => b.codes[brandId]);
  const step = Math.max(1, Math.floor(brandBeads.length / 6));
  return Array.from({ length: 6 }, (_, i) => {
    const idx = Math.min(i * step, brandBeads.length - 1);
    return brandBeads[idx]?.hex ?? "#999";
  });
}

export function BrandSelector({ value, onChange, disabled }: BrandSelectorProps) {
  // Precompute preview colors at top level — not inside .map()
  const brandColors = useMemo(
    () => BRANDS.map((b) => ({ id: b.id, colors: getBrandPreviewColors(b.id) })),
    []
  );

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-white/40 uppercase tracking-wide">
        厂家色号
      </span>
      <div className="grid grid-cols-2 gap-1.5">
        {BRANDS.map((brand) => {
          const preview = brandColors.find((b) => b.id === brand.id)!;
          return (
            <button
              key={brand.id}
              disabled={disabled}
              onClick={() => onChange(brand.id)}
              className={cn(
                "relative overflow-hidden py-2.5 px-3 text-xs rounded-xl transition-all text-left group",
                value === brand.id
                  ? "bg-white/[0.08] backdrop-blur-xl shadow-sm ring-1 ring-white/[0.15]"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.08] ring-1 ring-transparent"
              )}
            >
              <div className="flex gap-0.5 mb-2">
                {preview.colors.map((hex, i) => (
                  <span
                    key={i}
                    className="flex-1 h-1.5 rounded-sm"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
              <div className="font-semibold">{brand.name}</div>
              <div className="text-[10px] text-white/40 mt-0.5 leading-tight">
                {brand.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
