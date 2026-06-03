"use client";

import { Container } from "@/components/layout/container";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container size="narrow">
        <div className="relative rounded-3xl bg-[#1A1A1A] px-8 py-14 sm:px-14 sm:py-20 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#5E6AD2]/20 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-[#FF6B6B]/15 via-transparent to-transparent rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              准备好开始拼豆了吗？
            </h2>
            <p className="mt-3 text-sm text-[#9B9B9B] max-w-sm mx-auto">
              上传第一张照片，10 秒内生成拼豆图纸。完全免费，无需注册。
            </p>
            <a
              href="#generator"
              className="inline-flex items-center gap-2 mt-8 h-11 px-6 rounded-xl bg-white text-[#1A1A1A] text-sm font-medium hover:bg-[#F0F0F4] transition-colors"
            >
              立即开始
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
