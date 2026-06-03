"use client";

import { Container } from "@/components/layout/container";
import { samples } from "@/data/samples";
import { Grid3X3 } from "lucide-react";

export function ShowcaseSection() {
  return (
    <section id="showcase" className="py-20 sm:py-28 bg-[#F8F8FA]">
      <Container>
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            看看能做出什么
          </h2>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            上传你的照片，AI 自动生成对应风格的拼豆图纸
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {samples.map((sample) => (
            <div
              key={sample.id}
              className="group rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden hover:shadow-sm hover:ring-black/10 transition-all"
            >
              {/* Preview area — real blueprint would go here */}
              <div className="aspect-square bg-[#FAFAF8] flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="size-14 rounded-2xl bg-[#F0F0F4] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#5E6AD2]/8 transition-colors">
                    <Grid3X3 className="size-6 text-[#9B9B9B] group-hover:text-[#5E6AD2] transition-colors" />
                  </div>
                  <p className="text-xs text-[#9B9B9B]">
                    {sample.pixelSize}×{sample.pixelSize}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-black/5">
                <h3 className="text-sm font-semibold text-[#1A1A1A]">
                  {sample.title}
                </h3>
                <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                  {sample.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-medium text-[#9B9B9B] uppercase bg-[#F0F0F4] px-2 py-0.5 rounded-full">
                    {sample.pixelSize}×{sample.pixelSize}
                  </span>
                  <span className="text-[10px] font-medium text-[#9B9B9B] uppercase bg-[#F0F0F4] px-2 py-0.5 rounded-full">
                    约 {sample.beadCount} 颗
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#9B9B9B] mt-6">
          示例图片可自行替换，放入 public/samples/ 目录即可
        </p>
      </Container>
    </section>
  );
}
