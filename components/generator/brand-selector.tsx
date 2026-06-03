"use client";

import { cn } from "@/lib/utils";
import type { BrandId } from "@/lib/types";
import { BRANDS } from "@/lib/types";
import { Tag } from "lucide-react";

interface BrandSelectorProps {
  value: BrandId;
  onChange: (brand: BrandId) => void;
  disabled?: boolean;
}

export function BrandSelector({ value, onChange, disabled }: BrandSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tag className="size-3.5 text-[#6B6B6B]" />
        <span className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wide">
          厂家色号
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {BRANDS.map((brand) => (
          <button
            key={brand.id}
            disabled={disabled}
            onClick={() => onChange(brand.id)}
            className={cn(
              "py-2 px-3 text-xs font-medium rounded-lg transition-all text-left",
              value === brand.id
                ? "bg-white text-[#1A1A1A] shadow-sm ring-1 ring-black/5"
                : "text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-white/60"
            )}
          >
            <div className="font-semibold">{brand.name}</div>
            <div className="text-[10px] text-[#9B9B9B] mt-0.5 leading-tight">
              {brand.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
